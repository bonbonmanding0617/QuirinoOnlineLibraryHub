# 🚀 Quick Start: Profile Editing

## For Students

1. **Login** with student credentials
2. **Dashboard** - Click "✏️ Edit My Profile" button
3. **Edit** - Change name, email, school, grade
4. **Picture** - Click "📷 Change Photo" to upload
5. **Save** - Click "💾 Save Changes"
6. **Done** - Green ✅ notification shows success

## For Teachers

1. **Login** with teacher credentials  
2. **Dashboard** - Click "✏️ Edit My Profile" button
3. **Edit** - Change name, email, department, specialization
4. **Picture** - Click "📷 Change Photo" to upload
5. **Save** - Click "💾 Save Changes"
6. **Done** - Green ✅ notification shows success

## For Admins & Super Admins

1. **Login** with admin credentials
2. **Dashboard** - Click "✏️ Edit My Profile" button
3. **Edit** - Change name, email, phone, school
4. **Picture** - Click "📷 Change Photo" to upload
5. **Save** - Click "💾 Save Changes"
6. **Done** - Green ✅ notification shows success

---

## 📸 Profile Picture Upload Requirements

| Requirement | Limit |
|-------------|-------|
| **Maximum File Size** | 5 MB |
| **Allowed Formats** | JPG, PNG, GIF, WebP |
| **Recommended Size** | 150x150 pixels |
| **Display** | Round avatar with 3px border |

---

## 🔗 Profile Page Links

| User Type | Dashboard | Profile Page |
|-----------|-----------|--------------|
| **Student** | student-dashboard.html | student-profile.html |
| **Teacher** | teacher-dashboard.html | teacher-profile.html |
| **Admin** | admin-dashboard.html | admin-profile.html |
| **Super Admin** | super-admin-dashboard.html | admin-profile.html |

---

## ✅ Verification Steps

### Quick Test (2 minutes)

1. **Login** → Click profile link → Can you see your info?
2. **Edit** → Change one field → Click Save → See ✅ notification?
3. **Refresh** (F5) → Scroll to profile section → Data still there?
4. **Logout** → Login again → Profile data persisted?

### Complete Test (5 minutes)

1. ✅ Edit profile information
2. ✅ Upload profile picture
3. ✅ Refresh page (F5) - data still there
4. ✅ Close browser and reopen
5. ✅ Login again - profile still exists
6. ✅ Check DevTools → localStorage → "POLIS_users"
7. ✅ Verify your data and picture in localStorage

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| "Please login first" | Go to home page, login first |
| "Access denied" | You're on wrong profile page for your role |
| Changes don't save | Click "Save Changes" (not just Reset) |
| Picture doesn't upload | File must be < 5MB and image format |
| Can't see data after refresh | Check if you clicked "Save Changes" |
| Data lost after logout | Data is saved, login again to see it |

---

## 📱 Responsive Design

✅ Works on:
- 🖥️ Desktop (1920px and up)
- 💻 Laptop (1280px and up)  
- 📱 Tablets (768px and up)
- 📲 Mobile phones (320px and up)

---

## 🎨 Available Fields by Role

### Student Profile
```
Personal Information:
  - First Name
  - Last Name  
  - Email Address
  - School ID (read-only)
  - School/Institution
  - Grade Level
  
Profile Picture:
  - Upload/Change photo
  - Display as round avatar
```

### Teacher Profile
```
Personal Information:
  - First Name
  - Last Name
  - Email Address
  - Teacher ID (read-only)
  - School/Institution
  - Department
  - Specialization
  - Phone Number
  
Profile Picture:
  - Upload/Change photo
```

### Admin Profile
```
Personal Information:
  - First Name
  - Last Name
  - Email Address
  - Admin ID (read-only)
  - School/Institution
  - Phone Number
  
Profile Picture:
  - Upload/Change photo
  
Status Display:
  - Admin role badge
  - Account status (Active/Inactive)
  - Member since date
```

---

## 🔐 Security Notes

✅ **What You Can Do**:
- Edit your own profile information
- Upload your own profile picture
- Change personal contact info
- Update your email address

❌ **What You Cannot Do**:
- Edit other users' profiles
- Delete your own account
- Change your user ID
- Change your password (v1)
- Access unauthorized profile pages

---

## 📊 Storage Information

**All data saved to**:
- 🔒 **localStorage** (Permanent - survives browser close)
- 📝 **sessionStorage** (Temporary - cleared when browser closes)

**Access in DevTools**:
1. Press F12 (Developer Tools)
2. Go to "Application" tab
3. Expand "Storage" → "localStorage"
4. Look for "POLIS_users" key
5. Click it to see all user data

---

**Last Updated**: December 11, 2025  
**Version**: 1.0  
**Status**: ✅ Production Ready
