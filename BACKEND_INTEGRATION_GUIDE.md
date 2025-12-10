# 🔌 Backend Integration Guide - Quirino Library Hub

## Quick Start for Backend Developers

This guide helps backend developers integrate the frontend with database APIs.

---

## 🎯 API Endpoints Required

### Authentication Endpoints
```javascript
POST /api/auth/register
  - Fields: firstName, lastName, email, password, school, gradeLevel
  - Response: { userId, email, role: 'student' }

POST /api/auth/login
  - Fields: email, password
  - Response: { userId, email, name, role, school, gradeLevel }

POST /api/auth/logout
  - Clear server session
  - Response: { success: true }
```

### Profile Endpoints
```javascript
GET /api/auth/profile
  - Get current user profile
  - Response: { userId, firstName, lastName, email, school, gradeLevel, profilePic, schoolId }

PUT /api/auth/profile/update
  - Update: firstName, lastName, email, school, gradeLevel
  - Cannot update: schoolId (disabled on frontend)
  - Response: { success: true, updatedProfile }

POST /api/auth/profile/picture
  - Upload profile picture (multipart/form-data)
  - File: base64 image from frontend or binary upload
  - Response: { success: true, picUrl }

PUT /api/auth/password/change
  - Fields: currentPassword, newPassword, confirmPassword
  - Server must verify currentPassword before change
  - Response: { success: true }
```

### School Endpoints
```javascript
GET /api/schools
  - Get all schools (dropdown for profile/registration)
  - Response: [{ id, name, code, city, email, phone }]

POST /api/schools/create
  - Super Admin only
  - Fields: name, code, city, email, phone, address
  - Response: { id, success: true }

PUT /api/schools/:id
  - Super Admin only
  - Fields: name, code, city, email, phone, address
  - Response: { success: true }

DELETE /api/schools/:id
  - Super Admin only
  - Response: { success: true }

GET /api/schools/stats
  - Get statistics (total, active, student count)
  - Response: { totalSchools, activeSchools, totalStudents }
```

### Assignment Endpoints
```javascript
GET /api/assignments
  - Get all assignments for user
  - Response: [{ id, title, subject, description, dueDate, points, gradeLevel, status, grade }]

POST /api/assignments/create
  - Create new assignment
  - Fields: title, subject, description, dueDate, points, gradeLevel
  - Response: { id, success: true }

PUT /api/assignments/:id
  - Update assignment
  - Same fields as create
  - Response: { success: true }

DELETE /api/assignments/:id
  - Delete assignment (user must be creator)
  - Response: { success: true }

POST /api/assignments/:id/submit
  - Submit assignment with file
  - File: PDF or document
  - Response: { success: true, submittedAt }

PUT /api/assignments/:id/grade
  - Grade submitted assignment (Teacher/Admin only)
  - Fields: grade, feedback
  - Response: { success: true }
```

### Community/User Endpoints
```javascript
GET /api/community/members
  - Get all community members
  - Response: [{ id, name, school, grade, role, online, avatar }]

GET /api/community/members/search?q=query
  - Search members by name or school
  - Response: [{ id, name, school, grade, role }]

GET /api/community/members/:id
  - Get user profile card
  - Response: { id, name, school, grade, role, joinedDate, online }
```

### Messaging Endpoints
```javascript
GET /api/messages
  - Get conversation list
  - Response: [{ userId, userName, lastMessage, timestamp, unread }]

GET /api/messages/:userId
  - Get chat history with specific user
  - Response: [{ from, to, message, timestamp, read }]

POST /api/messages/send
  - Send message
  - Fields: recipientId, message
  - Response: { success: true, messageId, timestamp }

PUT /api/messages/:messageId/read
  - Mark message as read
  - Response: { success: true }

GET /api/users/:userId/status
  - Get user online status
  - Response: { online: true/false, lastSeen }
```

### Ebook Endpoints
```javascript
GET /api/ebooks
  - Get all ebooks in library
  - Response: [{ id, title, author, category, description, uploader, uploaderId, uploadDate }]

GET /api/ebooks/my
  - Get user's uploaded ebooks (Teacher/Admin only)
  - Response: [{ id, title, author, category, uploadDate, downloads }]

GET /api/ebooks/search?q=query&category=category
  - Search ebooks
  - Response: [{ id, title, author, category, uploader }]

POST /api/ebooks/upload
  - Upload new ebook (Teacher/Admin only)
  - Fields: title, author, category, description, file (PDF)
  - File size: max 50MB
  - Response: { id, success: true, fileUrl }

PUT /api/ebooks/:id
  - Edit ebook (uploader only)
  - Fields: title, author, category, description
  - Response: { success: true }

DELETE /api/ebooks/:id
  - Delete ebook (Super Admin or uploader only)
  - Response: { success: true }

GET /api/ebooks/:id
  - Get ebook details
  - Response: { id, title, author, category, description, uploader, uploadDate, fileUrl, downloads }

GET /api/ebooks/:id/download
  - Download ebook PDF
  - Response: Binary file stream
```

---

## 🔐 Authentication & Authorization

### User Roles
```javascript
const roles = {
  'student': 0,      // View only access
  'teacher': 1,      // Can create content
  'admin': 2,        // Can manage school content
  'super-admin': 3   // Full system access
}
```

### Frontend Role Checks
```javascript
// Example from ebooks.html
if (userRole !== 'student') {
  // Show upload button
}

if (userRole === 'super-admin' || uploaderId === currentUserId) {
  // Show delete button
}
```

### Backend Should Also Verify
Always validate permissions on server-side, never trust frontend claims:

```javascript
// Backend example (Node.js/Express)
app.delete('/api/ebooks/:id', (req, res) => {
  const user = req.user; // From JWT/Session
  const ebook = getEbookById(req.params.id);
  
  // Verify permission
  if (user.role !== 'super-admin' && user.id !== ebook.uploaderId) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  
  deleteEbook(ebook.id);
  res.json({ success: true });
});
```

---

## 📦 Data Models

### User Model
```javascript
{
  id: UUID,
  email: String (unique),
  password: String (hashed),
  firstName: String,
  lastName: String,
  schoolId: String (immutable - set at registration),
  school: String,
  gradeLevel: String (e.g., "10"),
  role: Enum ['student', 'teacher', 'admin', 'super-admin'],
  profilePic: String (URL),
  createdAt: DateTime,
  updatedAt: DateTime,
  lastLogin: DateTime
}
```

### School Model
```javascript
{
  id: UUID,
  name: String,
  code: String (unique, format: XX-###),
  city: String,
  email: String,
  phone: String,
  address: String,
  status: Enum ['active', 'inactive'],
  studentCount: Integer,
  createdAt: DateTime,
  updatedAt: DateTime
}
```

### Assignment Model
```javascript
{
  id: UUID,
  title: String,
  subject: String,
  description: String,
  dueDate: DateTime,
  points: Integer,
  gradeLevel: String,
  createdBy: UUID (Teacher/Admin ID),
  status: Enum ['pending', 'submitted', 'graded'],
  submittedDate: DateTime (nullable),
  grade: Integer (nullable, 0-100),
  feedback: String (nullable),
  createdAt: DateTime,
  updatedAt: DateTime
}
```

### Ebook Model
```javascript
{
  id: UUID,
  title: String,
  author: String,
  category: String,
  description: String,
  uploaderId: UUID,
  uploaderName: String,
  fileUrl: String,
  fileSize: Integer,
  uploadDate: DateTime,
  downloads: Integer,
  createdAt: DateTime,
  updatedAt: DateTime
}
```

### Message Model
```javascript
{
  id: UUID,
  senderId: UUID,
  recipientId: UUID,
  message: String,
  fileAttachment: String (nullable),
  read: Boolean,
  createdAt: DateTime,
  updatedAt: DateTime
}
```

---

## 🔄 Frontend Integration Code

### Example: How to Call API from Frontend

Current code pattern in pages (uses mock data):
```javascript
// BEFORE: Mock data
function loadAssignments() {
  const assignmentsData = [
    { id: 1, title: "Chapter 5 Review", ... }
  ];
  displayAssignments(assignmentsData);
}
```

Change to API call:
```javascript
// AFTER: Real API
async function loadAssignments() {
  try {
    const response = await fetch('/api/assignments', {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
      }
    });
    const assignmentsData = await response.json();
    displayAssignments(assignmentsData);
  } catch (error) {
    showAlert('Error loading assignments', 'error');
  }
}
```

### File Upload Example
```javascript
// From ebooks.html - currently uses file object
// Change to actual upload:

async function uploadEbook() {
  const formData = new FormData();
  formData.append('title', document.getElementById('ebookTitle').value);
  formData.append('author', document.getElementById('ebookAuthor').value);
  formData.append('category', document.getElementById('ebookCategory').value);
  formData.append('description', document.getElementById('ebookDescription').value);
  formData.append('file', document.getElementById('ebookFile').files[0]);

  const response = await fetch('/api/ebooks/upload', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${sessionStorage.getItem('token')}`
    },
    body: formData
  });

  if (response.ok) {
    showAlert('Ebook uploaded successfully!', 'success');
    loadEbooks();
  } else {
    showAlert('Upload failed', 'error');
  }
}
```

---

## 🗂️ Current Implementation Status

### Pages with TODO Comments:
- ✅ **student-profile.html** - Line ~430: "TODO: API integration for password change"
- ✅ **assignments.html** - Line ~280: "TODO: Send message via API"
- ✅ **community.html** - Line ~350: "TODO: API integration"
- ✅ **ebooks.html** - Line ~280: "TODO: API integration"
- ✅ **admin-schools.html** - Line ~200: "TODO: API integration"

### Mock Data Locations:
1. **assignments.html** - `loadAssignments()` function
2. **community.html** - `loadCommunityMembers()` function
3. **ebooks.html** - `loadEbooks()` function
4. **admin-schools.html** - `loadSchools()` function

Replace these with actual API calls.

---

## 🚀 Priority Integration Order

1. **Authentication First** (Login/Register)
   - Must work before any other API calls
   - Set token in sessionStorage after login

2. **Profile Endpoints**
   - Load user data on page load
   - Allow profile updates

3. **School Endpoints**
   - Populate school dropdown on registration/profile
   - School management for Super Admin

4. **Assignment Endpoints**
   - CRUD for assignments
   - Status tracking

5. **Ebook Endpoints**
   - Upload/download functionality
   - File storage integration

6. **Messaging & Community**
   - Real-time features last (WebSocket)
   - Start with basic HTTP polling

---

## 📊 Testing Endpoints

### Test Data Commands (Backend)

```bash
# Create test user
POST /api/auth/register
{
  "firstName": "John",
  "lastName": "Student",
  "email": "john@example.com",
  "password": "password123",
  "school": "Central High School",
  "gradeLevel": "10"
}

# Create test teacher
POST /api/auth/register
{
  "firstName": "Prof",
  "lastName": "Teacher",
  "email": "prof@example.com",
  "password": "password123",
  "role": "teacher",
  "school": "Central High School"
}

# Create test school
POST /api/schools/create
(Super Admin token required)
{
  "name": "North Academy",
  "code": "NA-001",
  "city": "Boston",
  "email": "info@northacademy.edu",
  "phone": "(617) 555-0456",
  "address": "456 Main St, Boston MA"
}
```

---

## 🐛 Error Handling

Frontend expects standard error responses:

```javascript
// Success Response
{ 
  success: true, 
  data: { ... } 
}

// Error Response
{ 
  success: false, 
  error: "Descriptive error message" 
}

// Frontend handles with:
if (response.ok) {
  showAlert('Success message', 'success');
} else {
  showAlert('Error message', 'error');
}
```

---

## 📝 Implementation Checklist

- [ ] Set up database with user models
- [ ] Implement authentication (JWT or session-based)
- [ ] Create profile endpoints
- [ ] Create school management endpoints
- [ ] Create assignment endpoints
- [ ] Create messaging endpoints
- [ ] Create ebook upload/storage
- [ ] Implement file upload handling
- [ ] Set up role-based authorization on backend
- [ ] Test all endpoints with frontend
- [ ] Set up WebSocket for real-time features
- [ ] Implement search/filtering
- [ ] Add database indexing for performance
- [ ] Set up logging and monitoring

---

## 📞 Common Integration Issues

### Issue: CORS Errors
**Solution:** Add CORS headers to backend:
```javascript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

### Issue: 401 Unauthorized
**Solution:** Verify token is sent in headers:
```javascript
headers: {
  'Authorization': `Bearer ${token}`
}
```

### Issue: File Upload Failures
**Solution:** Ensure multipart/form-data is handled:
```javascript
app.use(fileUpload()); // Or similar middleware
```

### Issue: Profile Picture Not Showing
**Solution:** Return URL not base64:
```javascript
// Frontend should receive URL from backend
response: { 
  profilePicUrl: 'https://cdn.example.com/pics/user123.jpg' 
}
```

---

## 🎓 Additional Resources

- Frontend uses sessionStorage for user data: `JSON.parse(sessionStorage.getItem('userData'))`
- All pages check login status on page load
- Role verification happens on both frontend (UX) and backend (security)
- Mock data serves as expected data structure reference

Good luck with integration! 🚀

