/**
 * Data Storage Manager
 * Handles persistent storage of user data, profile pictures, and ebooks
 * Uses localStorage for primary storage with sessionStorage fallback
 */

class DataStorageManager {
    constructor() {
        this.STORAGE_PREFIX = 'POLIS_';
        this.USERS_KEY = this.STORAGE_PREFIX + 'users';
        this.CURRENT_USER_KEY = this.STORAGE_PREFIX + 'currentUser';
        this.BOOKS_KEY = this.STORAGE_PREFIX + 'books';
        this.ASSIGNMENTS_KEY = this.STORAGE_PREFIX + 'assignments';
        this.BORROWING_KEY = this.STORAGE_PREFIX + 'borrowing';
        this.PROFILE_PICS_KEY = this.STORAGE_PREFIX + 'profilePics';
        this.EBOOKS_KEY = this.STORAGE_PREFIX + 'ebooks';
        
        this.initializeStorage();
    }

    /**
     * Initialize storage with default data if empty
     */
    initializeStorage() {
        if (!this.getAllUsers().length) {
            this.createDefaultUsers();
        }
        if (!this.getAllBooks().length) {
            this.createDefaultBooks();
        }
    }

    /**
     * USER MANAGEMENT
     */

    // Create default users
    createDefaultUsers() {
        const defaultUsers = [
            {
                id: 'STU-001',
                first_name: 'John',
                last_name: 'Smith',
                email: 'john@school.com',
                password: 'password123',
                role: 'student',
                school: 'Quirino School',
                class: 'Grade 10',
                status: 'active',
                joinDate: new Date('2024-01-15').toISOString(),
                profilePic: null,
                phone: '555-0101',
                address: '123 Main St'
            },
            {
                id: 'STU-002',
                first_name: 'Sarah',
                last_name: 'Johnson',
                email: 'sarah@school.com',
                password: 'password123',
                role: 'student',
                school: 'Quirino School',
                class: 'Grade 10',
                status: 'active',
                joinDate: new Date('2024-02-10').toISOString(),
                profilePic: null,
                phone: '555-0102',
                address: '456 Oak Ave'
            },
            {
                id: 'TEA-001',
                first_name: 'Michael',
                last_name: 'Brown',
                email: 'michael@school.com',
                password: 'password123',
                role: 'teacher',
                school: 'Quirino School',
                department: 'Mathematics',
                status: 'active',
                joinDate: new Date('2023-06-01').toISOString(),
                profilePic: null,
                phone: '555-0201',
                specialization: 'Algebra & Geometry'
            },
            {
                id: 'TEA-002',
                first_name: 'Emily',
                last_name: 'Davis',
                email: 'emily@school.com',
                password: 'password123',
                role: 'teacher',
                school: 'Quirino School',
                department: 'English',
                status: 'active',
                joinDate: new Date('2023-07-15').toISOString(),
                profilePic: null,
                phone: '555-0202',
                specialization: 'Literature & Writing'
            },
            {
                id: 'ADM-001',
                first_name: 'Robert',
                last_name: 'Wilson',
                email: 'robert@admin.com',
                password: 'admin123',
                role: 'admin',
                institution: 'Quirino School',
                permission_level: 'admin',
                status: 'active',
                joinDate: new Date('2023-01-01').toISOString(),
                profilePic: null,
                phone: '555-0301'
            },
            {
                id: 'SUP-001',
                first_name: 'Admin',
                last_name: 'Super',
                email: 'superadmin@school.com',
                password: 'super123',
                role: 'super-admin',
                institution: 'Quirino School',
                permission_level: 'super-admin',
                status: 'active',
                joinDate: new Date('2022-01-01').toISOString(),
                profilePic: null,
                phone: '555-0999'
            }
        ];

        localStorage.setItem(this.USERS_KEY, JSON.stringify(defaultUsers));
        sessionStorage.setItem('allUsers', JSON.stringify(defaultUsers));
    }

    // Get all users
    getAllUsers() {
        try {
            const users = localStorage.getItem(this.USERS_KEY);
            return users ? JSON.parse(users) : [];
        } catch (e) {
            console.error('Error reading users:', e);
            return [];
        }
    }

    // Get user by ID
    getUserById(id) {
        const users = this.getAllUsers();
        return users.find(u => u.id === id);
    }

    // Get user by email
    getUserByEmail(email) {
        const users = this.getAllUsers();
        return users.find(u => u.email.toLowerCase() === email.toLowerCase());
    }

    // Create new user
    createUser(userData) {
        const users = this.getAllUsers();
        const newUser = {
            id: userData.id || this.generateUserId(userData.role),
            ...userData,
            joinDate: userData.joinDate || new Date().toISOString(),
            profilePic: userData.profilePic || null,
            status: userData.status || 'active'
        };
        
        users.push(newUser);
        this.saveUsers(users);
        return newUser;
    }

    // Update user
    updateUser(id, updates) {
        const users = this.getAllUsers();
        const userIndex = users.findIndex(u => u.id === id);
        
        if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], ...updates };
            this.saveUsers(users);
            this.updateCurrentUserIfMatch(id, users[userIndex]);
            return users[userIndex];
        }
        return null;
    }

    // Delete user
    deleteUser(id) {
        const users = this.getAllUsers();
        const filtered = users.filter(u => u.id !== id);
        this.saveUsers(filtered);
        return filtered;
    }

    // Save users to storage
    saveUsers(users) {
        try {
            localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
            sessionStorage.setItem('allUsers', JSON.stringify(users));
        } catch (e) {
            console.error('Error saving users:', e);
        }
    }

    // Generate user ID based on role
    generateUserId(role) {
        const prefix = {
            'student': 'STU',
            'teacher': 'TEA',
            'admin': 'ADM',
            'super-admin': 'SUP'
        }[role] || 'USR';

        const users = this.getAllUsers();
        const roleUsers = users.filter(u => u.id.startsWith(prefix));
        const number = roleUsers.length + 1;
        return `${prefix}-${String(number).padStart(3, '0')}`;
    }

    /**
     * CURRENT USER MANAGEMENT
     */

    // Set current logged-in user
    setCurrentUser(user) {
        try {
            localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
            sessionStorage.setItem('userData', JSON.stringify(user));
        } catch (e) {
            console.error('Error setting current user:', e);
        }
    }

    // Get current logged-in user
    getCurrentUser() {
        try {
            let user = localStorage.getItem(this.CURRENT_USER_KEY);
            if (!user) {
                user = sessionStorage.getItem('userData');
            }
            return user ? JSON.parse(user) : null;
        } catch (e) {
            console.error('Error reading current user:', e);
            return null;
        }
    }

    // Update current user
    updateCurrentUser(updates) {
        const currentUser = this.getCurrentUser();
        if (currentUser) {
            const updated = { ...currentUser, ...updates };
            this.setCurrentUser(updated);
            this.updateUser(currentUser.id, updates);
            return updated;
        }
        return null;
    }

    // Update current user if it matches the ID
    updateCurrentUserIfMatch(id, data) {
        const current = this.getCurrentUser();
        if (current && current.id === id) {
            this.setCurrentUser(data);
        }
    }

    // Clear current user (logout)
    clearCurrentUser() {
        localStorage.removeItem(this.CURRENT_USER_KEY);
        sessionStorage.removeItem('userData');
        sessionStorage.removeItem('allUsers');
    }

    /**
     * PROFILE PICTURE MANAGEMENT
     */

    // Save profile picture
    saveProfilePicture(userId, imageData) {
        try {
            const pics = this.getAllProfilePictures();
            pics[userId] = imageData;
            localStorage.setItem(this.PROFILE_PICS_KEY, JSON.stringify(pics));
            
            // Also update in user object
            this.updateUser(userId, { profilePic: imageData });
            
            return true;
        } catch (e) {
            console.error('Error saving profile picture:', e);
            return false;
        }
    }

    // Get profile picture
    getProfilePicture(userId) {
        try {
            const pics = this.getAllProfilePictures();
            return pics[userId] || null;
        } catch (e) {
            console.error('Error reading profile picture:', e);
            return null;
        }
    }

    // Get all profile pictures
    getAllProfilePictures() {
        try {
            const pics = localStorage.getItem(this.PROFILE_PICS_KEY);
            return pics ? JSON.parse(pics) : {};
        } catch (e) {
            console.error('Error reading profile pictures:', e);
            return {};
        }
    }

    // Delete profile picture
    deleteProfilePicture(userId) {
        try {
            const pics = this.getAllProfilePictures();
            delete pics[userId];
            localStorage.setItem(this.PROFILE_PICS_KEY, JSON.stringify(pics));
            this.updateUser(userId, { profilePic: null });
            return true;
        } catch (e) {
            console.error('Error deleting profile picture:', e);
            return false;
        }
    }

    /**
     * BOOK MANAGEMENT
     */

    // Create default books
    createDefaultBooks() {
        const defaultBooks = [
            {
                id: 'BOOK-001',
                title: 'The Great Gatsby',
                author: 'F. Scott Fitzgerald',
                isbn: '978-0-7432-7356-5',
                category: 'Fiction',
                year: 1925,
                totalCopies: 5,
                availableCopies: 3,
                description: 'A classic American novel set in the Jazz Age.',
                publisher: 'Scribner',
                coverImage: null,
                addedDate: new Date().toISOString()
            },
            {
                id: 'BOOK-002',
                title: 'To Kill a Mockingbird',
                author: 'Harper Lee',
                isbn: '978-0-06-112008-4',
                category: 'Fiction',
                year: 1960,
                totalCopies: 4,
                availableCopies: 2,
                description: 'A story of racial injustice and childhood innocence.',
                publisher: 'J.B. Lippincott',
                coverImage: null,
                addedDate: new Date().toISOString()
            },
            {
                id: 'BOOK-003',
                title: 'Physics Fundamentals',
                author: 'David Halliday',
                isbn: '978-0-470-04473-8',
                category: 'Science',
                year: 2010,
                totalCopies: 6,
                availableCopies: 4,
                description: 'Comprehensive guide to physics principles.',
                publisher: 'Wiley',
                coverImage: null,
                addedDate: new Date().toISOString()
            }
        ];

        localStorage.setItem(this.BOOKS_KEY, JSON.stringify(defaultBooks));
    }

    // Get all books
    getAllBooks() {
        try {
            const books = localStorage.getItem(this.BOOKS_KEY);
            return books ? JSON.parse(books) : [];
        } catch (e) {
            console.error('Error reading books:', e);
            return [];
        }
    }

    // Get book by ID
    getBookById(id) {
        const books = this.getAllBooks();
        return books.find(b => b.id === id);
    }

    // Create new book
    createBook(bookData) {
        const books = this.getAllBooks();
        const newBook = {
            id: bookData.id || this.generateBookId(),
            ...bookData,
            addedDate: bookData.addedDate || new Date().toISOString()
        };
        
        books.push(newBook);
        this.saveBooks(books);
        return newBook;
    }

    // Update book
    updateBook(id, updates) {
        const books = this.getAllBooks();
        const bookIndex = books.findIndex(b => b.id === id);
        
        if (bookIndex !== -1) {
            books[bookIndex] = { ...books[bookIndex], ...updates };
            this.saveBooks(books);
            return books[bookIndex];
        }
        return null;
    }

    // Delete book
    deleteBook(id) {
        const books = this.getAllBooks();
        const filtered = books.filter(b => b.id !== id);
        this.saveBooks(filtered);
        return filtered;
    }

    // Save books to storage
    saveBooks(books) {
        try {
            localStorage.setItem(this.BOOKS_KEY, JSON.stringify(books));
        } catch (e) {
            console.error('Error saving books:', e);
        }
    }

    // Generate book ID
    generateBookId() {
        const books = this.getAllBooks();
        const number = books.length + 1;
        return `BOOK-${String(number).padStart(3, '0')}`;
    }

    /**
     * EBOOK MANAGEMENT
     */

    // Save ebook metadata
    saveEbookMetadata(ebookData) {
        try {
            const ebooks = this.getAllEbooks();
            const newEbook = {
                id: ebookData.id || `EBOOK-${Date.now()}`,
                ...ebookData,
                uploadDate: ebookData.uploadDate || new Date().toISOString()
            };
            
            ebooks.push(newEbook);
            localStorage.setItem(this.EBOOKS_KEY, JSON.stringify(ebooks));
            return newEbook;
        } catch (e) {
            console.error('Error saving ebook metadata:', e);
            return null;
        }
    }

    // Get all ebooks
    getAllEbooks() {
        try {
            const ebooks = localStorage.getItem(this.EBOOKS_KEY);
            return ebooks ? JSON.parse(ebooks) : [];
        } catch (e) {
            console.error('Error reading ebooks:', e);
            return [];
        }
    }

    // Delete ebook
    deleteEbook(id) {
        try {
            const ebooks = this.getAllEbooks();
            const filtered = ebooks.filter(e => e.id !== id);
            localStorage.setItem(this.EBOOKS_KEY, JSON.stringify(ebooks));
            return filtered;
        } catch (e) {
            console.error('Error deleting ebook:', e);
            return null;
        }
    }

    /**
     * UTILITY FUNCTIONS
     */

    // Clear all data
    clearAllData() {
        try {
            localStorage.removeItem(this.USERS_KEY);
            localStorage.removeItem(this.CURRENT_USER_KEY);
            localStorage.removeItem(this.BOOKS_KEY);
            localStorage.removeItem(this.PROFILE_PICS_KEY);
            localStorage.removeItem(this.EBOOKS_KEY);
            sessionStorage.removeItem('userData');
            sessionStorage.removeItem('allUsers');
            this.initializeStorage();
        } catch (e) {
            console.error('Error clearing data:', e);
        }
    }

    // Export all data
    exportData() {
        return {
            users: this.getAllUsers(),
            currentUser: this.getCurrentUser(),
            books: this.getAllBooks(),
            profilePictures: this.getAllProfilePictures(),
            ebooks: this.getAllEbooks()
        };
    }

    // Import data
    importData(data) {
        try {
            if (data.users) localStorage.setItem(this.USERS_KEY, JSON.stringify(data.users));
            if (data.currentUser) localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(data.currentUser));
            if (data.books) localStorage.setItem(this.BOOKS_KEY, JSON.stringify(data.books));
            if (data.profilePictures) localStorage.setItem(this.PROFILE_PICS_KEY, JSON.stringify(data.profilePictures));
            if (data.ebooks) localStorage.setItem(this.EBOOKS_KEY, JSON.stringify(data.ebooks));
            return true;
        } catch (e) {
            console.error('Error importing data:', e);
            return false;
        }
    }

    // Get storage stats
    getStorageStats() {
        return {
            totalUsers: this.getAllUsers().length,
            totalBooks: this.getAllBooks().length,
            totalEbooks: this.getAllEbooks().length,
            profilePicturesCount: Object.keys(this.getAllProfilePictures()).length,
            storageUsed: this.getStorageUsed()
        };
    }

    // Get approximate storage used
    getStorageUsed() {
        let total = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                total += localStorage[key].length + key.length;
            }
        }
        return (total / 1024).toFixed(2) + ' KB';
    }
}

// Initialize global storage manager
const storageManager = new DataStorageManager();
