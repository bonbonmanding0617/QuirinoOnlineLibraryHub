QUICK START - USER DATA STORAGE SYSTEM
=====================================

🚀 GET STARTED IN 5 MINUTES

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STEP 1: OPEN THE WEBSITE
  → Open: index.html in your browser

STEP 2: TEST LOGIN
  Email:    superadmin@school.com
  Password: super123
  Click: "Admin Login"

STEP 3: EXPLORE USER MANAGEMENT
  → Click: "All Users Management" button
  → See all users organized by role
  → Click on "Manage Students", "Manage Teachers", etc.

STEP 4: CREATE NEW USER
  → Click: "+ Add Student" (or Teacher/Admin)
  → Fill form with new user details
  → Click: "Save"
  → ✅ User now stored permanently!

STEP 5: UPLOAD PROFILE PICTURE
  → Click: "Edit" on any user
  → Upload an image file
  → Click: "Save"
  → ✅ Picture stored and persists!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TEST ACCOUNTS (Ready to Use)

STUDENT:
  Email: john@school.com
  Password: password123

TEACHER:
  Email: michael@school.com
  Password: password123

ADMIN:
  Email: robert@admin.com
  Password: admin123

SUPER ADMIN:
  Email: superadmin@school.com
  Password: super123

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WHAT'S STORED

✅ User Profiles
   - Name, email, phone, address
   - School/Department
   - Status, join date
   - User ID and role

✅ Profile Pictures
   - Stored as base64 images
   - Supports JPEG, PNG, GIF, WebP
   - Max 5MB per image

✅ Book Catalog
   - Title, author, ISBN
   - Category, publication year
   - Copies available/total
   - Description

✅ Session Data
   - Currently logged-in user
   - All users (for admin)
   - Role information

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WHERE DATA IS STORED

Browser localStorage (permanent):
  Press F12 → Application → Storage → LocalStorage
  Look for: POLIS_users, POLIS_books, etc.

Browser sessionStorage (current session):
  Press F12 → Application → Storage → SessionStorage
  Look for: userData, allUsers

Data persists:
  ✅ After page refresh
  ✅ After closing browser
  ✅ After system restart
  ✅ Across all pages

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

KEY FEATURES

📚 STUDENT VIEW
  → Student Dashboard
  → Profile editing (no password popup!)
  → Browse books
  → Borrow books
  → Join community

👨‍🏫 TEACHER VIEW
  → Teacher Dashboard
  → Profile editing
  → Add new books
  → Grade assignments
  → Manage classes

⚙️ ADMIN VIEW
  → Admin Dashboard
  → Manage schools
  → Approve borrowing
  → System settings
  → Reports

👑 SUPER ADMIN VIEW
  → Super Admin Dashboard
  → Manage all users
  → Add/edit/delete users
  → Create other admins
  → View system statistics

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

COMMON ACTIONS

LOGIN:
  1. Go to index.html
  2. Select user type (Student/Teacher/Admin)
  3. Enter email and password
  4. Click "Login"
  5. ✅ Redirects to dashboard
  6. ✅ Data persists on refresh

LOGOUT:
  1. Click "Logout" button
  2. Confirm logout
  3. Redirects to login page
  4. ✅ User data cleared from memory

EDIT PROFILE:
  1. Click "Edit Profile"
  2. Change information
  3. Upload profile picture (optional)
  4. Click "Save"
  5. ✅ Changes persist automatically

ADD NEW USER (Super Admin):
  1. Go to "All Users Management"
  2. Click "Add Student/Teacher/Admin"
  3. Fill in details
  4. Click "Create"
  5. ✅ User stored and can login

MANAGE USERS (Super Admin):
  1. Visit "Manage Students/Teachers/Admins"
  2. Search or scroll through users
  3. Click "Edit" to modify user
  4. Click "Delete" to remove user
  5. ✅ Changes saved immediately

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WHAT'S NEW IN THIS UPDATE

🆕 Upload Folders
   → /uploads/ebooks/ for ebook files
   → /uploads/profile-pictures/ for user pictures

🆕 Data Storage Manager
   → js/data-storage.js handles all storage

🆕 Persistent Storage
   → Data now survives browser restart!
   → No more loss of data on logout

🆕 User Management Pages
   → admin-manage-users.html (hub)
   → admin-manage-students.html
   → admin-manage-teachers.html
   → admin-manage-admins.html

🆕 Enhanced Authentication
   → Login checks stored credentials
   → Redirects based on user role
   → Session persists across refreshes

🆕 Profile Picture Support
   → Upload from any page
   → Stored in localStorage
   → Displays in all user cards

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TROUBLESHOOTING

Q: Data disappeared after closing browser
A: Check F12 > Application > Storage
   Data should still be there
   If not, browser settings may clear on close

Q: Can't login
A: Check email spelling (case-insensitive)
   Make sure password matches exactly
   Look in F12 console for errors

Q: Profile picture not showing
A: Ensure image is < 5MB
   Try different format (JPEG, PNG)
   Check F12 > Network tab for upload errors

Q: Too slow on many users
A: This is normal with 100+ users in browser
   Upgrade to backend database for production

Q: How to backup data
A: Open F12 > Console:
   let backup = storageManager.exportData();
   console.log(JSON.stringify(backup));
   Copy and save the JSON

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BROWSER COMPATIBILITY

✅ Chrome/Edge - Full support
✅ Firefox - Full support
✅ Safari - Full support
✅ Mobile browsers - Full support

Storage limits:
  Desktop: 5-10 MB
  Mobile: 5-10 MB

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SECURITY NOTES

⚠️ This uses browser localStorage (demo only)
   For production, you should:
   • Use a backend database
   • Hash passwords (don't store plain text)
   • Use HTTPS only
   • Implement JWT authentication
   • Add rate limiting
   • Use secure cloud storage for files

✅ Current implementation is suitable for:
   • Development testing
   • Demo purposes
   • Proof of concept
   • Educational projects
   • Internal use

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NEED HELP?

📖 Read: USER_DATA_STORAGE_GUIDE.md
📖 Read: uploads/README.md
📖 Read: STORAGE_IMPLEMENTATION.md

Check the console (F12):
  storageManager.getStorageStats()

View all users:
  storageManager.getAllUsers()

View current user:
  storageManager.getCurrentUser()

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

That's it! Your user data storage is ready to use.
All data is stored permanently and persists across sessions.

Happy testing! 🚀
