# Uploads Directory

This directory contains all user-generated content and media files for the Quirino Online Library Hub.

## Directory Structure

```
uploads/
├── ebooks/                 # All uploaded ebook files
│   ├── book-001.pdf
│   ├── book-002.epub
│   └── ...
├── profile-pictures/       # All user profile pictures
│   ├── user-001.jpg
│   ├── user-002.png
│   └── ...
└── README.md             # This file
```

## Storage Guidelines

### Profile Pictures (`/profile-pictures/`)
- **Purpose:** User profile pictures for all roles (students, teachers, admins)
- **Formats Supported:** JPEG, PNG, GIF, WebP
- **Max File Size:** 5MB per image
- **Naming Convention:** `{userId}-{timestamp}.{extension}`
- **Example:** `STU-001-1701234567.jpg`
- **Storage Method:** Base64 encoded in localStorage (primary), file system (secondary)

### Ebooks (`/ebooks/`)
- **Purpose:** Digital books and educational materials uploaded by teachers
- **Formats Supported:** PDF, EPUB, MOBI, TXT
- **Max File Size:** 50MB per file
- **Naming Convention:** `{bookId}-{title}.{extension}`
- **Example:** `BOOK-001-physics-fundamentals.pdf`
- **Storage Method:** LocalStorage metadata + File system for actual files

## Database Schema

### User Data Storage
All user data is stored in localStorage under the key `POLIS_users`:

```javascript
{
    id: "STU-001",
    first_name: "John",
    last_name: "Smith",
    email: "john@school.com",
    password: "hashedPassword",
    role: "student" | "teacher" | "admin" | "super-admin",
    school: "School Name",
    class: "Grade/Class",
    department: "Department (teachers only)",
    status: "active" | "inactive" | "pending",
    joinDate: "2024-01-15T10:30:00Z",
    profilePic: "data:image/jpeg;base64,..." or null,
    phone: "555-0101",
    address: "123 Main St"
}
```

### Book Data Storage
All book metadata is stored in localStorage under the key `POLIS_books`:

```javascript
{
    id: "BOOK-001",
    title: "Physics Fundamentals",
    author: "David Halliday",
    isbn: "978-0-470-04473-8",
    category: "Science",
    year: 2010,
    totalCopies: 6,
    availableCopies: 4,
    description: "Comprehensive guide to physics principles",
    publisher: "Wiley",
    coverImage: "data:image/jpeg;base64,..." or null,
    addedDate: "2024-01-20T14:30:00Z"
}
```

### Profile Picture Storage
Stored in localStorage under `POLIS_profilePics`:

```javascript
{
    "STU-001": "data:image/jpeg;base64,...",
    "TEA-001": "data:image/png;base64,...",
    "ADM-001": "data:image/jpeg;base64,..."
}
```

### Ebook Metadata
Stored in localStorage under `POLIS_ebooks`:

```javascript
{
    id: "EBOOK-001",
    title: "Advanced Mathematics",
    fileName: "advanced-math.pdf",
    fileSize: 2048000,
    uploadedBy: "TEA-001",
    uploadDate: "2024-01-25T09:15:00Z",
    category: "Educational",
    description: "Advanced math concepts for Grade 12"
}
```

## Usage Guide

### Accessing the Storage Manager

```javascript
// The storage manager is globally available
storageManager.getAllUsers();
storageManager.getCurrentUser();
storageManager.getAllBooks();
storageManager.getAllProfilePictures();
storageManager.getAllEbooks();
```

### Working with Users

```javascript
// Create new user
const newStudent = storageManager.createUser({
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

// Get user by email
const user = storageManager.getUserByEmail('john@school.com');
```

### Working with Profile Pictures

```javascript
// Save profile picture (base64 format)
storageManager.saveProfilePicture('STU-001', 'data:image/jpeg;base64,...');

// Get profile picture
const pic = storageManager.getProfilePicture('STU-001');

// Delete profile picture
storageManager.deleteProfilePicture('STU-001');
```

### Working with Books

```javascript
// Create new book
const newBook = storageManager.createBook({
    title: 'New Science Book',
    author: 'John Scientist',
    isbn: '978-0-123456-78-9',
    category: 'Science',
    year: 2024,
    totalCopies: 10,
    availableCopies: 8,
    description: 'A comprehensive science guide',
    publisher: 'Science Press'
});

// Update book
storageManager.updateBook('BOOK-001', {
    availableCopies: 3
});

// Delete book
storageManager.deleteBook('BOOK-001');
```

### Working with Ebooks

```javascript
// Save ebook metadata
const newEbook = storageManager.saveEbookMetadata({
    title: 'Python Programming',
    fileName: 'python-guide.pdf',
    fileSize: 3048000,
    uploadedBy: 'TEA-001',
    category: 'Programming',
    description: 'Complete guide to Python'
});

// Get all ebooks
const ebooks = storageManager.getAllEbooks();

// Delete ebook
storageManager.deleteEbook('EBOOK-001');
```

## Storage Limits

- **localStorage Capacity:** ~5-10MB per domain (browser dependent)
- **Maximum Users:** ~200-300 users (with profile pictures)
- **Maximum Books:** ~500-1000 books (with metadata)
- **Maximum Profile Pictures:** ~100-200 (high-quality images)

## Data Persistence

All data is automatically persisted across:
- ✅ Page refreshes
- ✅ Browser restarts
- ✅ Tab switching
- ✅ New windows/tabs on same domain

Data is **cleared only** when:
- ❌ Browser storage is manually cleared
- ❌ clearAllData() function is called
- ❌ Cookies/storage settings are reset

## Backup & Export

```javascript
// Export all data
const backup = storageManager.exportData();
console.log(JSON.stringify(backup));

// Import data from backup
storageManager.importData(backup);

// Get storage statistics
const stats = storageManager.getStorageStats();
// {
//     totalUsers: 6,
//     totalBooks: 50,
//     totalEbooks: 15,
//     profilePicturesCount: 6,
//     storageUsed: '2.34 KB'
// }
```

## Security Notes

⚠️ **Important:** This implementation uses localStorage for demo purposes.
For production use, consider:
- Implementing a backend database (MySQL, MongoDB, PostgreSQL)
- Using secure file storage (AWS S3, Azure Blob Storage)
- Adding password hashing (bcrypt, argon2)
- Implementing JWT authentication
- Using HTTPS only
- Adding rate limiting and CORS

## File Size Recommendations

| Content Type | Recommended Size | Max Size |
|-------------|------------------|----------|
| Profile Picture | 200-500 KB | 5 MB |
| Ebook (PDF) | 1-20 MB | 50 MB |
| Book Cover | 100-300 KB | 2 MB |
| Ebook Metadata | < 10 KB | N/A |

## Troubleshooting

### Storage Full
If you get "QuotaExceededError":
1. Clear old/unused data
2. Export important data to JSON
3. Clear browser storage
4. Reimport data

### Data Loss
If data appears lost:
1. Check browser developer tools (F12 > Application > Storage)
2. Verify user role has write permissions
3. Check browser's localStorage settings
4. Try clearing and reinitializing storage

### Profile Pictures Not Loading
1. Ensure image is in base64 format
2. Check browser console for errors
3. Verify user ID matches in storage
4. Try uploading smaller images first

---

**Last Updated:** December 2024
**Version:** 1.0
**Maintained By:** Quirino Library Hub Development Team
