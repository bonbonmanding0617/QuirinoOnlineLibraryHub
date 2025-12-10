# Registration Feature - Implementation Guide

## Overview

The registration feature has been added to your Online Library Hub, allowing new users to create accounts as either students or teachers.

---

## What Was Added

### 1. Frontend Registration UI (`index.html`)

- **New Registration Form** with the following fields:
  - First Name (required)
  - Last Name (required)
  - Email (required)
  - Password (required, minimum 6 characters)
  - Confirm Password (required)
  - Role Selection (Student/Teacher - required)
  - Class/Grade (conditional - only for students)
  - Department (conditional - only for teachers)

- **Form Toggle** - Smooth switching between login and registration forms
- **Dynamic Fields** - Class/Department fields show/hide based on role selection
- **Validation** - Client-side validation for all inputs

### 2. Frontend JavaScript (`assets/js/auth.js`)

**New Functions:**
- `toggleRegistration()` - Switch between login and registration forms
- `toggleRoleFields()` - Show/hide conditional fields based on role
- Enhanced `registrationForm` submit handler with:
  - Password match validation
  - Password strength check (minimum 6 characters)
  - API call to `/api/auth/register`
  - Fallback to demo mode if API fails
  - Auto-redirect to login form on success

- **Updated Login Handler** with API support:
  - Attempts API login first
  - Falls back to demo mode if API unavailable
  - Sends role along with credentials

### 3. Backend API Endpoints (`API_ENDPOINTS.js`)

**New Endpoints:**

#### `POST /api/auth/register`
Register a new user

**Request:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student",
  "class": "10-A"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "userId": 1
}
```

**Response (Error):**
```json
{
  "error": "Email already registered"
}
```

**Validation:**
- Email uniqueness check
- Role validation (student/teacher only)
- Required field validation
- Email format validation (frontend)

#### `POST /api/auth/login`
Login an existing user

**Request:**
```json
{
  "email": "john@example.com",
  "password": "password123",
  "role": "student"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "student",
    "class": "10-A",
    "userType": "student"
  }
}
```

---

## How It Works

### Registration Flow

```
User clicks "Sign up here"
    ↓
Registration form displayed
    ↓
User selects role (Student/Teacher)
    ↓
Conditional fields shown (Class for Student / Department for Teacher)
    ↓
User fills all required fields
    ↓
Submit button → Validation checks
    ↓
Password match check ✓
Password length check (min 6 chars) ✓
All required fields filled ✓
    ↓
API Call: POST /api/auth/register
    ↓
Backend checks:
  - Email uniqueness ✓
  - Role validity ✓
  - Required fields ✓
    ↓
User created in database
    ↓
Success message displayed
    ↓
Form switches back to login
    ↓
User logs in with new credentials
```

### Login Flow

```
User enters email, password, role
    ↓
Submit button → Basic validation
    ↓
API Call: POST /api/auth/login
    ↓
Backend checks:
  - User exists ✓
  - Password matches ✓
  - Role matches ✓
    ↓
User data returned
    ↓
Stored in sessionStorage
    ↓
Redirect to appropriate dashboard
```

---

## Database Considerations

### Users Table
The existing `users` table supports registration with these fields:

```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role ENUM('student', 'teacher', 'admin') NOT NULL,
    class VARCHAR(50),           -- For students
    department VARCHAR(100),     -- For teachers
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## Testing Registration

### Test Case 1: Register as Student

1. Click "Sign up here"
2. Fill in:
   - First Name: John
   - Last Name: Doe
   - Email: john.doe@example.com
   - Password: password123
   - Confirm Password: password123
   - Role: Student
   - Class: 10-A
3. Click Register
4. Success message appears
5. Form switches to login

### Test Case 2: Register as Teacher

1. Click "Sign up here"
2. Fill in:
   - First Name: Sarah
   - Last Name: Johnson
   - Email: sarah.johnson@example.com
   - Password: teacher123
   - Confirm Password: teacher123
   - Role: Teacher
   - Department: Mathematics
3. Click Register
4. Success message appears

### Test Case 3: Validation Errors

**Password Mismatch:**
- Password: password123
- Confirm: password456
- Alert: "Passwords do not match"

**Password Too Short:**
- Password: pass
- Confirm: pass
- Alert: "Password must be at least 6 characters long"

**Duplicate Email:**
- Email: existing@email.com
- Alert: "Email already registered"

---

## Next Steps: Implement on Backend

### Step 1: Install Password Hashing (Recommended)
```bash
npm install bcrypt jsonwebtoken
```

### Step 2: Update Registration Endpoint
In `API_ENDPOINTS.js`, uncomment and implement bcrypt:

```javascript
const bcrypt = require('bcrypt');

// Hash password
const hashedPassword = await bcrypt.hash(password, 10);

// Create user with hashed password
const result = await dbService.createUser({
  email: email,
  password: hashedPassword,  // Use hashed password
  first_name: first_name,
  last_name: last_name,
  role: role,
  class: role === 'student' ? classValue : null,
  department: role === 'teacher' ? department : null,
  created_at: new Date()
});
```

### Step 3: Update Login Endpoint
```javascript
const bcrypt = require('bcrypt');

// Get user by email
const user = await dbService.getUserByEmail(email);

// Verify password
const isPasswordValid = await bcrypt.compare(password, user.password);
if (!isPasswordValid) {
  return res.status(401).json({ error: 'Invalid email or password' });
}
```

### Step 4: Add JWT Authentication (Optional but Recommended)
```javascript
const jwt = require('jsonwebtoken');

// Generate token
const token = jwt.sign(
  { userId: user.id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);

// Return token to client
res.json({
  success: true,
  message: 'Login successful',
  user: userWithoutPassword,
  token: token
});
```

### Step 5: Protect Routes with JWT Middleware
```javascript
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

// Use on protected routes
app.get('/api/user/profile', authenticateToken, (req, res) => {
  // Protected route
});
```

---

## Features by Role

### Student Registration
- **Required Fields**: First Name, Last Name, Email, Password, Class
- **Can Access**: 
  - Browse books
  - Borrow books
  - View assignments
  - Submit assignments
  - Check reading progress

### Teacher Registration
- **Required Fields**: First Name, Last Name, Email, Password, Department
- **Can Access**:
  - Manage books
  - Create assignments
  - View student submissions
  - Grade assignments
  - Generate reports

### Admin (Manual Addition Recommended)
- **Not Self-Registerable** (for security)
- **Create via**: Direct database insert or admin panel
- **Full Access**: All features

---

## Security Best Practices

### Current Implementation
- ✅ Client-side validation
- ✅ Email uniqueness check
- ✅ Role-based field requirements
- ✅ Password confirmation check

### Recommended Enhancements
- [ ] Implement bcrypt password hashing
- [ ] Add JWT token authentication
- [ ] Add rate limiting on registration/login endpoints
- [ ] Add email verification (optional)
- [ ] Add HTTPS in production
- [ ] Sanitize user input
- [ ] Add CSRF protection
- [ ] Implement password reset functionality
- [ ] Add account lockout after failed attempts
- [ ] Log authentication events

---

## Troubleshooting

### Registration Form Not Showing
- Check browser console for JavaScript errors
- Verify `toggleRegistration()` function is defined
- Check that registration form HTML has correct IDs

### API Endpoint Not Found (404)
- Ensure `API_ENDPOINTS.js` code is copied to `server.js`
- Verify Express app is running on correct port
- Check that routes are defined before `app.listen()`

### Email Already Registered Error
- User needs to use a different email address
- Or reset/recover existing account (feature to implement)

### Password Mismatch Validation
- Ensure both password fields match exactly
- Check for leading/trailing spaces
- Minimum 6 characters required

### API Calls Failing
- Check that backend server is running (`npm start`)
- Verify database is connected and populated
- Check network tab in browser DevTools for response details
- Fall back to demo mode works without backend

---

## Database Setup

If not already done, initialize the database:

```bash
# Connect to MySQL
mysql -u root -p

# Create database and tables
SOURCE database/init.sql;
SOURCE database/schema.sql;

# Optional: Load sample data
SOURCE database/sample-data.sql;
```

---

## Testing the API with cURL

### Register a New User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "student",
    "class": "10-A"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123",
    "role": "student"
  }'
```

---

## Files Modified

1. **`index.html`**
   - Added registration form with toggle functionality
   - New registration box with conditional fields

2. **`assets/js/auth.js`**
   - Added `toggleRegistration()` function
   - Added `toggleRoleFields()` function
   - Updated form submission handlers for registration and login
   - Added API call support with fallback to demo mode

3. **`API_ENDPOINTS.js`**
   - Added `POST /api/auth/register` endpoint
   - Added `POST /api/auth/login` endpoint
   - Added comprehensive validation and error handling

---

## Future Enhancements

- [ ] Email verification
- [ ] Password reset via email
- [ ] Social login (Google, Facebook, etc.)
- [ ] Two-factor authentication
- [ ] User profile management
- [ ] Account deactivation
- [ ] Admin user management panel
- [ ] Activity logging
- [ ] IP-based suspicious login alerts

---

## Summary

Your application now has:
- ✅ User registration with role-based fields
- ✅ User login with email and password
- ✅ Client-side validation
- ✅ Backend API endpoints for authentication
- ✅ Database integration ready
- ✅ Fallback demo mode for development

**Next Step**: Copy `API_ENDPOINTS.js` code to `server.js` and implement bcrypt/JWT for production security.

