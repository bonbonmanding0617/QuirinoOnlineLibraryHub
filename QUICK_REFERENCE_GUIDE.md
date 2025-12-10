# ⚡ Quick Reference Guide - Quirino Library Hub

## 🚀 Fast Navigation

### 📄 Pages Created
```
Student Profile Management
  📁 pages/student-profile.html (480 lines)
  ├─ Route: /pages/student-profile.html
  ├─ Access: Students only (role check)
  └─ Features: Edit profile, upload picture, change password, logout

Assignment Management
  📁 pages/assignments.html (450 lines)
  ├─ Route: /pages/assignments.html
  ├─ Access: All users
  └─ Features: List, create, submit, grade, delete assignments

School Management
  📁 pages/admin-schools.html (420 lines)
  ├─ Route: /pages/admin-schools.html
  ├─ Access: Super Admin only
  └─ Features: CRUD schools, statistics, validation

Community Hub
  📁 pages/community.html (500 lines)
  ├─ Route: /pages/community.html
  ├─ Access: All logged-in users
  └─ Features: User directory, search, 1-to-1 messaging

Ebook Library
  📁 pages/ebooks.html (480 lines)
  ├─ Route: /pages/ebooks.html
  ├─ Access: All logged-in users
  └─ Features: Browse, upload, edit, delete (permission-based)
```

---

## 🎯 Key Features Summary

| Feature | Page | Access | Main Action |
|---------|------|--------|------------|
| **Edit Profile** | student-profile.html | Student | PUT /api/auth/profile/update |
| **Upload Picture** | student-profile.html | Student | POST /api/auth/profile/picture |
| **Logout** | student-profile.html | All | POST /api/auth/logout |
| **Assignments** | assignments.html | All | GET/POST/DELETE /api/assignments |
| **Schools** | admin-schools.html | Super Admin | CRUD /api/schools |
| **Messages** | community.html | All | GET/POST /api/messages |
| **Directory** | community.html | All | GET /api/community/members |
| **Ebooks** | ebooks.html | All | CRUD /api/ebooks |

---

## 🔐 Access Control Reference

```javascript
// Role-based access (check on each page)
if (role === 'student') {
  // View: profile, assignments, community, ebooks
  // Actions: edit profile, submit assignments, chat, download ebooks
}

if (role === 'teacher' || role === 'admin') {
  // View: all above + school data
  // Actions: create assignments, upload ebooks, edit own ebooks
}

if (role === 'super-admin') {
  // View: everything
  // Actions: all of above + manage schools + delete any ebook
}
```

---

## 🎨 Design System

```css
/* Colors */
Primary: #8B3A3A (Indigo)
Secondary: #C84C4C (Cyan)
Success: #10B981 (Green)
Danger: #EF4444 (Red)
Warning: #F59E0B (Orange)

/* Responsive */
Mobile: < 768px
Desktop: >= 768px

/* Spacing */
Standard gap: 10-20px
Section padding: 20-30px
Component padding: 8-15px
```

---

## 📝 Form Validation Reference

| Field | Validation |
|-------|-----------|
| School Code | Regex: `^[A-Z]{2,}-\d{3}$` (e.g., CHS-001) |
| Profile Picture | File size ≤ 5MB, type: image/* |
| Ebook File | File size ≤ 50MB, type: application/pdf |
| Password | Min 6 characters, must match confirmation |
| Email | Must be valid email format |
| Required Fields | Checked before form submission |

---

## 🔗 API Endpoint Quick List

### Auth
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register
- `GET /api/auth/profile` - Get profile
- `PUT /api/auth/profile/update` - Update profile
- `POST /api/auth/password/change` - Change password

### Schools
- `GET /api/schools` - List schools
- `POST /api/schools/create` - Create school
- `PUT /api/schools/:id` - Update school
- `DELETE /api/schools/:id` - Delete school

### Assignments
- `GET /api/assignments` - List assignments
- `POST /api/assignments/create` - Create assignment
- `DELETE /api/assignments/:id` - Delete assignment
- `PUT /api/assignments/:id/grade` - Grade assignment

### Community
- `GET /api/community/members` - List members
- `GET /api/messages` - List conversations
- `GET /api/messages/:userId` - Get chat history
- `POST /api/messages/send` - Send message

### Ebooks
- `GET /api/ebooks` - List ebooks
- `POST /api/ebooks/upload` - Upload ebook
- `PUT /api/ebooks/:id` - Edit ebook
- `DELETE /api/ebooks/:id` - Delete ebook

---

## 📊 Data Structure Quick Reference

### User Object (sessionStorage)
```javascript
{
  id: "user123",
  email: "student@example.com",
  firstName: "John",
  lastName: "Student",
  role: "student",
  school: "Central High School",
  schoolId: "CHS-001",
  gradeLevel: "10",
  profilePic: "base64_string_or_url"
}
```

### Assignment Object
```javascript
{
  id: 1,
  title: "Chapter Review",
  subject: "Math",
  dueDate: "2024-12-20",
  points: 100,
  status: "pending|submitted|graded",
  grade: 92
}
```

### Ebook Object
```javascript
{
  id: 1,
  title: "Mathematics Basics",
  author: "Prof Smith",
  category: "Mathematics",
  uploaderId: "teacher1",
  fileSize: 2500000,
  uploadDate: "2024-01-15"
}
```

---

## 🔄 Common Workflows

### Student Login Flow
```
1. User logs in → email + password → /api/auth/login
2. Server returns user data + token
3. Frontend stores in sessionStorage
4. User redirected to dashboard
5. All pages verify sessionStorage.userData exists
6. API calls include Authorization header
```

### Create Assignment Flow
```
1. User opens assignments.html
2. Clicks "Create Assignment" tab
3. Fills form (title, subject, due date, etc.)
4. Submits form
5. Frontend validates → POST /api/assignments/create
6. Server stores in database
7. Page refreshes → lists updated assignments
```

### Upload Ebook Flow
```
1. Teacher opens ebooks.html
2. Clicks "+ Add E-book" button
3. Modal opens
4. Fills form + selects PDF file
5. Submits → POST /api/ebooks/upload with FormData
6. Server processes upload + stores file
7. Database record created
8. Page refreshes → shows new ebook
```

---

## 🧪 Testing Checklist

### User Profile
- [ ] Login as student
- [ ] Edit each field separately
- [ ] Try to edit School ID (should fail/be disabled)
- [ ] Upload profile picture
- [ ] Change password
- [ ] Logout successfully

### Assignments
- [ ] View assignment list
- [ ] Create assignment (all fields required)
- [ ] Submit assignment
- [ ] Delete assignment (confirm dialog)
- [ ] Check status updates

### Schools (Super Admin)
- [ ] View school list
- [ ] Add school with valid code format
- [ ] Add school with invalid code (should fail)
- [ ] Edit school information
- [ ] Delete school (confirm dialog)
- [ ] Check statistics

### Community
- [ ] Search for members by name
- [ ] Search for members by school
- [ ] Start chat with member
- [ ] Send message
- [ ] View message history
- [ ] Close chat and return to list

### Ebooks
- [ ] Browse ebook library
- [ ] Login as teacher
- [ ] Upload ebook (test validation)
- [ ] Edit own ebook
- [ ] Delete own ebook
- [ ] Login as Super Admin
- [ ] Delete any ebook
- [ ] Login as student
- [ ] Verify no upload button

---

## 🛠️ File Modification Guide

### To Add a New School Field
1. Open `pages/admin-schools.html`
2. Find `<div class="form-group">` section in modal form
3. Add new input field
4. Update form submission handler
5. Update API call in backend

### To Change Button Colors
1. Find color definitions in CSS style section
2. Update `.btn-primary`, `.btn-secondary`, etc.
3. Changes apply globally to all buttons

### To Add New Assignment Status
1. Open `pages/assignments.html`
2. Find status badge code in `displayAssignments()` function
3. Add new status case in switch statement
4. Update CSS class for badge styling

### To Add New Ebook Category
1. Open `pages/ebooks.html`
2. Find `<select id="ebookCategory">`
3. Add new `<option>` element
4. Backend will automatically handle

---

## 📱 Responsive Design Notes

### Mobile (< 768px)
- Sidebar collapses to full width
- Tables become card view
- Buttons stack vertically
- Reduced padding and margins
- Single column layouts

### Desktop (>= 768px)
- Side-by-side layouts
- Multi-column grids
- Full width tables
- Normal spacing

### Testing Responsive
- Use browser DevTools (F12)
- Toggle Device Toolbar
- Test at multiple breakpoints
- Check horizontal scroll

---

## 🚨 Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Page shows login page | User not logged in | Check sessionStorage.userData exists |
| Buttons don't appear | Role check failed | Verify user.role matches requirement |
| Form validation fails | Invalid format | Check regex patterns in code |
| File upload fails | File too large | Check size limits (5MB images, 50MB PDFs) |
| API calls 404 | Endpoint not implemented | Check BACKEND_INTEGRATION_GUIDE.md |

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `FEATURE_COMPLETION_SUMMARY.md` | Overview of all features + testing checklist |
| `BACKEND_INTEGRATION_GUIDE.md` | API endpoints + integration instructions |
| `IMPLEMENTATION_REPORT.md` | Project completion summary + metrics |
| `QUICK_REFERENCE_GUIDE.md` | This file - quick lookup |

---

## 🎯 Next Steps for Development

### Immediate (This Week)
- [ ] Set up backend API structure
- [ ] Implement authentication endpoints
- [ ] Create database models
- [ ] Test endpoints with Postman

### Short Term (Next Week)
- [ ] Integrate frontend with APIs
- [ ] Test all workflows end-to-end
- [ ] Fix bugs and issues
- [ ] Performance optimization

### Medium Term (Following Week)
- [ ] Add real-time features (WebSocket)
- [ ] Implement file storage
- [ ] Add search functionality
- [ ] Security hardening

---

## 💡 Pro Tips

1. **SessionStorage Persistence:** User data persists across page reloads until logout
2. **Mock Data Pattern:** All pages use same mock data structure as API responses
3. **Authorization:** Always check role on backend, don't trust frontend claims
4. **File Validation:** Validate file type AND size on both frontend and backend
5. **Error Handling:** All alert messages auto-dismiss after 4 seconds
6. **Responsive Testing:** Test at 320px, 768px, and 1920px widths

---

## 📞 Support Resources

- **Frontend Code:** Look in `pages/` directory
- **Styles:** Defined in `<style>` tag within each HTML file
- **JavaScript:** Defined in `<script>` tag within each HTML file
- **Documentation:** Check `.md` files in project root
- **Examples:** Mock data shows expected API response format

---

**Quick Start:** Open any page in `pages/` folder with correct user role  
**Integration:** Follow BACKEND_INTEGRATION_GUIDE.md for API setup  
**Testing:** Use testing checklist in FEATURE_COMPLETION_SUMMARY.md  

---

**Ready to go!** 🚀

