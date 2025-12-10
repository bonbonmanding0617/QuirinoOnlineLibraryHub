# User Data Storage System - Complete Guide

## 🎯 Overview

The Quirino Online Library Hub now features a **complete persistent user data storage system** that stores and manages:

✅ **User Profiles** - Students, Teachers, Admins, Super Admins  
✅ **Profile Pictures** - All user avatar images  
✅ **Book Inventory** - Library catalog and metadata  
✅ **Ebook Files** - Digital book metadata and uploads  
✅ **Session Data** - Login information and current user state  

---

## 📁 New Directory Structure

```
Pedlisan Online Library Hub/
├── uploads/                          # NEW: Upload storage directory
│   ├── ebooks/                       # Store all ebook files
│   ├── profile-pictures/             # Store all profile pictures
│   └── README.md                     # Storage guide
├── js/
│   └── data-storage.js               # NEW: Storage manager script
├── pages/
│   ├── admin-manage-users.html       # NEW: User management hub
│   ├── admin-manage-students.html    # NEW: Student management
│   ├── admin-manage-teachers.html    # NEW: Teacher management
│   ├── admin-manage-admins.html      # NEW: Admin management
│   └── ... (all other pages)
└── ... (other directories)
```

---

## 🔑 Key Features

### 1. **Persistent User Storage**
- Automatically saves all user data to localStorage
- Syncs with sessionStorage for real-time access
- Data persists across page refreshes and browser restarts
- 6 default users pre-configured (students, teachers, admins)

### 2. **User Role Management**
```
Student (STU-0XX)
  - School, Grade, Class
  - Profile picture support
  - Reading progress tracking

Teacher (TEA-0XX)
  - Department/Subject
  - Can add and grade assignments
  - Profile picture support

Admin (ADM-0XX)
  - Manage all system operations
  - Full user management
  - Can manage school settings

Super Admin (SUP-0XX)
  - Complete system control
  - User management dashboard
  - Can create other admins
```

### 3. **Profile Picture Management**
- Base64 encoded storage in localStorage
- Automatic persistence on upload
- Fallback emoji display when no picture
- Support for JPEG, PNG, GIF, WebP formats

### 4. **Book & Ebook Management**
- Complete book metadata storage
- Ebook file tracking and metadata
- Inventory management (copies available vs total)
- Category-based organization

### 5. **Authentication System**
- Login verification against stored credentials
- Role-based redirect to correct dashboard
- Session persistence
- Automatic logout with data cleanup

---

## 💾 Data Storage Architecture

### Storage Locations

```javascript
// localStorage keys (persistent across sessions)
POLIS_users              // All user accounts
POLIS_currentUser        // Currently logged-in user
POLIS_books              // Book inventory
POLIS_profilePics        // User profile pictures
POLIS_ebooks             // Ebook metadata

// sessionStorage keys (session only)
userData                 // Current user copy
allUsers                 // All users copy for admin views
```

### Storage Capacity

| Type | Capacity | Current Usage |
|------|----------|---------------|
| localStorage | ~5-10 MB | ~100-200 KB |
| Profile Pictures | ~2-5 MB | ~50 KB (6 users) |
| Books | ~1-2 MB | ~25 KB (3-50 books) |
| Ebooks | ~2-5 MB | Metadata only |
| **Total Safe Limit** | **~10 MB** | **~200-300 KB** |

---

## 🔐 Default Test Accounts

### Students
```
Email: john@school.com
Password: password123
Role: Student
ID: STU-001

Email: sarah@school.com
Password: password123
Role: Student
ID: STU-002
```

### Teachers
```
Email: michael@school.com
Password: password123
Role: Teacher
ID: TEA-001

Email: emily@school.com
Password: password123
Role: Teacher
ID: TEA-002
```

### Admins
```
Email: robert@admin.com
Password: admin123
Role: Admin
ID: ADM-001

Email: superadmin@school.com
Password: super123
Role: Super Admin
ID: SUP-001
```

---

## 🛠️ Using the Storage Manager

The `storageManager` object is globally available in all pages.

### User Operations

```javascript
// Get all users
const allUsers = storageManager.getAllUsers();

// Get current logged-in user
const user = storageManager.getCurrentUser();

// Get user by ID
const user = storageManager.getUserById('STU-001');

// Get user by email
const user = storageManager.getUserByEmail('john@school.com');

// Create new user
const newUser = storageManager.createUser({
    first_name: 'Jane',
    last_name: 'Doe',
    email: 'jane@school.com',
    password: 'password123',
    role: 'student',
    school: 'Quirino School',
    class: 'Grade 11'
});

// Update user
storageManager.updateUser('STU-001', {
    phone: '555-9999',
    address: 'New Address'
});

// Delete user
storageManager.deleteUser('STU-001');

// Set current user (on login)
storageManager.setCurrentUser(user);

// Clear current user (on logout)
storageManager.clearCurrentUser();
```

### Profile Picture Operations

```javascript
// Save profile picture (base64)
storageManager.saveProfilePicture('STU-001', 'data:image/jpeg;base64,...');

// Get profile picture
const pic = storageManager.getProfilePicture('STU-001');

// Delete profile picture
storageManager.deleteProfilePicture('STU-001');

// Get all profile pictures
const allPics = storageManager.getAllProfilePictures();
```

### Book Operations

```javascript
// Get all books
const books = storageManager.getAllBooks();

// Get book by ID
const book = storageManager.getBookById('BOOK-001');

// Create new book
const newBook = storageManager.createBook({
    title: 'New Science Book',
    author: 'John Scientist',
    isbn: '978-0-123456-78-9',
    category: 'Science',
    year: 2024,
    totalCopies: 10,
    availableCopies: 8,
    description: 'A comprehensive guide',
    publisher: 'Science Press'
});

// Update book
storageManager.updateBook('BOOK-001', {
    availableCopies: 3
});

// Delete book
storageManager.deleteBook('BOOK-001');
```

### Ebook Operations

```javascript
// Save ebook metadata
const newEbook = storageManager.saveEbookMetadata({
    title: 'Python Programming',
    fileName: 'python-guide.pdf',
    fileSize: 3048000,
    uploadedBy: 'TEA-001',
    category: 'Programming',
    description: 'Complete Python guide'
});

// Get all ebooks
const ebooks = storageManager.getAllEbooks();

// Delete ebook
storageManager.deleteEbook('EBOOK-001');
```

---

## 📋 Implementation Examples

### Example 1: User Registration

```javascript
// In student-register.html form submission:
const newStudent = storageManager.createUser({
    first_name: document.getElementById('firstName').value,
    last_name: document.getElementById('lastName').value,
    email: document.getElementById('email').value,
    password: document.getElementById('password').value,
    role: 'student',
    school: 'Quirino School',
    class: document.getElementById('class').value
});

storageManager.setCurrentUser(newStudent);
window.location.href = 'pages/student-dashboard.html';
```

### Example 2: User Login

```javascript
// In index.html login form:
const user = storageManager.getUserByEmail(email);
if (user && user.password === password && user.status === 'active') {
    storageManager.setCurrentUser(user);
    window.location.href = getDashboard(user.role);
}
```

### Example 3: Profile Picture Upload

```javascript
// In profile edit page:
const fileInput = document.getElementById('profilePic');
const file = fileInput.files[0];
const reader = new FileReader();

reader.onload = (e) => {
    const base64 = e.target.result;
    const user = storageManager.getCurrentUser();
    storageManager.saveProfilePicture(user.id, base64);
    storageManager.updateCurrentUser({ profilePic: base64 });
};

reader.readAsDataURL(file);
```

### Example 4: Managing Users (Admin)

```javascript
// In admin-manage-students.html:
const students = storageManager.getAllUsers()
    .filter(u => u.role === 'student');

// Display students...

// Update student
storageManager.updateUser('STU-001', {
    status: 'inactive'
});

// Delete student
storageManager.deleteUser('STU-001');
```

---

## 🔄 Data Flow Diagram

```
User Registration/Login
    ↓
Verify credentials with storageManager.getUserByEmail()
    ↓
storageManager.setCurrentUser(user)
    ↓
Stored in localStorage POLIS_currentUser
    ↓
Synced to sessionStorage userData
    ↓
Page redirects to appropriate dashboard
    ↓
Dashboard loads current user from storageManager.getCurrentUser()
    ↓
User edits profile
    ↓
storageManager.updateCurrentUser(changes)
    ↓
Updated in both localStorage and sessionStorage
    ↓
All pages see updated data automatically
    ↓
On logout: storageManager.clearCurrentUser()
    ↓
Data cleared from both storages
```

---

## 📊 User Management Pages

### Super Admin Dashboard
- **Location:** `pages/super-admin-dashboard.html`
- **Features:** Create users, view statistics, manage schools
- **Access:** Super Admin only

### User Management Hub
- **Location:** `pages/admin-manage-users.html`
- **Features:** View all users by role, quick access to management pages
- **Access:** Super Admin only

### Student Management
- **Location:** `pages/admin-manage-students.html`
- **Features:** Add, edit, delete, search students
- **Access:** Super Admin only

### Teacher Management
- **Location:** `pages/admin-manage-teachers.html`
- **Features:** Add, edit, delete, search teachers
- **Access:** Super Admin only

### Admin Management
- **Location:** `pages/admin-manage-admins.html`
- **Features:** Add, edit, delete, search admins
- **Access:** Super Admin only

---

## ⚙️ Configuration

### Initialization
Storage manager initializes automatically with:
- 6 default users (students, teachers, admins)
- 3 sample books
- Empty profile pictures and ebooks collections

### Custom Initialization
```javascript
// Clear all data and reinitialize
storageManager.clearAllData();

// Import data from backup
const backup = JSON.parse(backupString);
storageManager.importData(backup);
```

---

## 📈 Monitoring & Debugging

### Get Storage Statistics
```javascript
const stats = storageManager.getStorageStats();
console.log(stats);
// {
//   totalUsers: 6,
//   totalBooks: 50,
//   totalEbooks: 15,
//   profilePicturesCount: 6,
//   storageUsed: '2.34 KB'
// }
```

### Export All Data
```javascript
const backup = storageManager.exportData();
console.log(JSON.stringify(backup, null, 2));
// Save to file or send to server
```

### Browser Developer Tools
```
1. Press F12 to open Developer Tools
2. Go to "Application" tab
3. Expand "Storage" → "LocalStorage"
4. Find entries starting with "POLIS_"
5. View/edit data in JSON format
```

---

## ✅ Verification Checklist

- [x] Folders created: `/uploads`, `/uploads/ebooks`, `/uploads/profile-pictures`
- [x] Storage manager implemented: `js/data-storage.js`
- [x] Auth system updated to use storage manager
- [x] Default test accounts created
- [x] User management pages implemented (4 pages)
- [x] Profile picture support enabled
- [x] Data persistence across sessions
- [x] Login verification implemented
- [x] Role-based redirection working
- [x] Storage documentation complete

---

## 🚀 Next Steps

### For Testing:
1. Open `index.html` in browser
2. Try logging in with test accounts
3. Visit user management pages (Super Admin only)
4. Add/edit/delete users
5. Upload profile pictures
6. Check F12 > Application > LocalStorage for data

### For Production:
1. Implement backend database (MySQL/MongoDB)
2. Add password hashing (bcrypt)
3. Implement JWT authentication
4. Use secure file storage (AWS S3, Azure Blob)
5. Add rate limiting and CORS
6. Enable HTTPS only
7. Implement data backup/export

---

## 📝 File Reference

| File | Purpose | Location |
|------|---------|----------|
| data-storage.js | Storage manager class | `js/` |
| index.html | Login page (updated) | Root |
| student-register.html | Registration form | Root |
| student-profile.html | Profile management | `pages/` |
| teacher-profile-edit.html | Teacher profile | `pages/` |
| admin-profile-edit.html | Admin profile | `pages/` |
| admin-manage-users.html | User management hub | `pages/` |
| admin-manage-students.html | Student management | `pages/` |
| admin-manage-teachers.html | Teacher management | `pages/` |
| admin-manage-admins.html | Admin management | `pages/` |
| super-admin-dashboard.html | Super admin panel | `pages/` |

---

## 🔗 Quick Links

- **Storage Manager Code:** `/js/data-storage.js`
- **Upload Directory Guide:** `/uploads/README.md`
- **Test Accounts:** See "Default Test Accounts" section above
- **User Management Pages:** `/pages/admin-manage-*.html`

---

**Last Updated:** December 11, 2024  
**Version:** 1.0  
**Status:** ✅ Complete and Ready to Use

