# Integration Guide - Borrowing Approval System

**Purpose:** Step-by-step guide to integrate the Borrowing Approval System with your backend API.

---

## Table of Contents
1. [Database Setup](#database-setup)
2. [Backend API Implementation](#backend-api-implementation)
3. [Frontend Integration](#frontend-integration)
4. [Testing](#testing)
5. [Troubleshooting](#troubleshooting)

---

## Database Setup

### Step 1: Update Borrowings Table

Run this migration to add approval fields to your existing borrowings table:

```sql
-- Add new columns for approval workflow
ALTER TABLE borrowings 
ADD COLUMN approval_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending' AFTER status,
ADD COLUMN approved_by INT AFTER approval_status,
ADD COLUMN approval_date DATETIME AFTER approved_by,
ADD COLUMN rejection_reason TEXT AFTER approval_date,
ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at;

-- Add foreign key for approved_by
ALTER TABLE borrowings 
ADD CONSTRAINT fk_approved_by 
FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL;

-- Add index for faster queries
ALTER TABLE borrowings 
ADD INDEX idx_approval_status (approval_status);
```

### Step 2: Verify the Schema

```sql
DESCRIBE borrowings;
```

Expected columns:
- id (PK)
- user_id (FK)
- book_id (FK)
- borrowed_date
- due_date
- returned_date
- **status** (enum: pending, approved, rejected, borrowed, returned, overdue)
- **approval_status** (enum: pending, approved, rejected) ← NEW
- **approved_by** (FK) ← NEW
- **approval_date** ← NEW
- **rejection_reason** ← NEW
- created_at
- **updated_at** ← NEW

---

## Backend API Implementation

### Step 1: Create API Routes

#### Node.js/Express Example:

```javascript
// routes/borrowings.js
const express = require('express');
const router = express.Router();
const borrowingController = require('../controllers/borrowingController');
const auth = require('../middleware/auth');

// Student endpoints
router.post('/request', auth.requireLogin, borrowingController.createRequest);
router.get('/my-requests', auth.requireLogin, borrowingController.getMyRequests);
router.get('/current', auth.requireLogin, borrowingController.getCurrentBorrowings);
router.put('/:id/return', auth.requireLogin, borrowingController.returnBook);
router.get('/history', auth.requireLogin, borrowingController.getBorrowingHistory);

// Teacher/Admin endpoints
router.get('/pending', auth.requireTeacherOrAdmin, borrowingController.getPendingRequests);
router.put('/:id/approve', auth.requireTeacherOrAdmin, borrowingController.approveBorrowing);
router.put('/:id/reject', auth.requireTeacherOrAdmin, borrowingController.rejectBorrowing);

module.exports = router;
```

### Step 2: Create Controllers

```javascript
// controllers/borrowingController.js
const Borrowing = require('../models/Borrowing');
const Book = require('../models/Book');
const User = require('../models/User');
const Notification = require('../models/Notification');

// Create borrowing request
exports.createRequest = async (req, res) => {
    try {
        const { book_id, due_date, reason } = req.body;
        const user_id = req.user.id;

        // Validate request
        if (!book_id || !due_date) {
            return res.status(400).json({
                success: false,
                message: 'Book ID and due date are required'
            });
        }

        // Check if book exists and is available
        const book = await Book.findById(book_id);
        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }

        if (book.available_copies <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Book is not available',
                code: 'BOOK_UNAVAILABLE'
            });
        }

        // Check for pending duplicate request
        const existingRequest = await Borrowing.findOne({
            where: {
                user_id,
                book_id,
                approval_status: 'pending'
            }
        });

        if (existingRequest) {
            return res.status(409).json({
                success: false,
                message: 'You already have a pending request for this book',
                code: 'DUPLICATE_REQUEST'
            });
        }

        // Check borrowing limit (5 active borrowings)
        const activeCount = await Borrowing.count({
            where: {
                user_id,
                approval_status: 'approved'
            }
        });

        if (activeCount >= 5) {
            return res.status(400).json({
                success: false,
                message: 'You have reached the maximum borrowing limit (5 books)'
            });
        }

        // Create borrowing record
        const borrowing = await Borrowing.create({
            user_id,
            book_id,
            borrowed_date: new Date(),
            due_date,
            reason,
            status: 'pending',
            approval_status: 'pending'
        });

        // Notify teachers/admins
        const teachers = await User.findAll({
            where: { role: ['teacher', 'admin'] }
        });

        for (let teacher of teachers) {
            await Notification.create({
                user_id: teacher.id,
                type: 'BORROWING_REQUEST',
                title: 'New Borrowing Request',
                message: `${req.user.name} requested "${book.title}"`,
                data: { borrowing_id: borrowing.id }
            });
        }

        res.status(201).json({
            success: true,
            message: 'Borrowing request submitted',
            borrowing: {
                id: borrowing.id,
                user_id,
                book_id,
                due_date,
                status: 'pending',
                approval_status: 'pending',
                created_at: borrowing.created_at
            }
        });

    } catch (error) {
        console.error('Error creating borrowing request:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create borrowing request',
            error: error.message
        });
    }
};

// Get pending requests (for teachers/admins)
exports.getPendingRequests = async (req, res) => {
    try {
        const { class_id, limit = 10, offset = 0 } = req.query;
        const user = req.user;

        let whereClause = { approval_status: 'pending' };

        // Teachers see only their class requests
        if (user.role === 'teacher') {
            whereClause.class_id = class_id || user.class_id;
        }

        const requests = await Borrowing.findAndCountAll({
            where: whereClause,
            include: [
                { model: User, attributes: ['id', 'name', 'email', 'class'] },
                { model: Book, attributes: ['id', 'title', 'author', 'isbn'] }
            ],
            order: [['created_at', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.json({
            success: true,
            count: requests.count,
            requests: requests.rows.map(r => ({
                id: r.id,
                user: r.User,
                book: r.Book,
                requested_date: r.created_at,
                due_date: r.due_date,
                approval_status: r.approval_status,
                reason: r.reason
            }))
        });

    } catch (error) {
        console.error('Error fetching pending requests:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch pending requests'
        });
    }
};

// Approve borrowing request
exports.approveBorrowing = async (req, res) => {
    try {
        const { id } = req.params;
        const user_id = req.user.id;

        const borrowing = await Borrowing.findByPk(id, {
            include: [User, Book]
        });

        if (!borrowing) {
            return res.status(404).json({
                success: false,
                message: 'Borrowing request not found'
            });
        }

        if (borrowing.approval_status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'This request has already been processed'
            });
        }

        // Update borrowing record
        borrowing.approval_status = 'approved';
        borrowing.approved_by = user_id;
        borrowing.approval_date = new Date();
        borrowing.status = 'approved';
        borrowing.borrowed_date = new Date();

        await borrowing.save();

        // Update book availability
        const book = await Book.findByPk(borrowing.book_id);
        book.available_copies -= 1;
        await book.save();

        // Notify student
        await Notification.create({
            user_id: borrowing.user_id,
            type: 'BORROWING_APPROVED',
            title: 'Borrowing Request Approved',
            message: `Your request for "${borrowing.Book.title}" has been approved!`,
            data: { borrowing_id: borrowing.id }
        });

        res.json({
            success: true,
            message: 'Borrowing request approved',
            borrowing: {
                id: borrowing.id,
                approval_status: 'approved',
                approved_by: borrowing.approved_by,
                approval_date: borrowing.approval_date,
                status: 'approved'
            }
        });

    } catch (error) {
        console.error('Error approving borrowing:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to approve borrowing request'
        });
    }
};

// Reject borrowing request
exports.rejectBorrowing = async (req, res) => {
    try {
        const { id } = req.params;
        const { rejection_reason } = req.body;
        const user_id = req.user.id;

        const borrowing = await Borrowing.findByPk(id, {
            include: [User, Book]
        });

        if (!borrowing) {
            return res.status(404).json({
                success: false,
                message: 'Borrowing request not found'
            });
        }

        if (borrowing.approval_status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'This request has already been processed'
            });
        }

        // Update borrowing record
        borrowing.approval_status = 'rejected';
        borrowing.approved_by = user_id;
        borrowing.approval_date = new Date();
        borrowing.rejection_reason = rejection_reason || 'Request was rejected';
        borrowing.status = 'rejected';

        await borrowing.save();

        // Notify student
        await Notification.create({
            user_id: borrowing.user_id,
            type: 'BORROWING_REJECTED',
            title: 'Borrowing Request Rejected',
            message: `Your request for "${borrowing.Book.title}" was rejected: ${borrowing.rejection_reason}`,
            data: { borrowing_id: borrowing.id }
        });

        res.json({
            success: true,
            message: 'Borrowing request rejected',
            borrowing: {
                id: borrowing.id,
                approval_status: 'rejected',
                approved_by: borrowing.approved_by,
                rejection_reason: borrowing.rejection_reason,
                approval_date: borrowing.approval_date
            }
        });

    } catch (error) {
        console.error('Error rejecting borrowing:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to reject borrowing request'
        });
    }
};

// Get student's requests
exports.getMyRequests = async (req, res) => {
    try {
        const user_id = req.user.id;
        const { status, limit = 10 } = req.query;

        let whereClause = { user_id };
        if (status) {
            whereClause.approval_status = status;
        }

        const requests = await Borrowing.findAll({
            where: whereClause,
            include: [
                { model: Book, attributes: ['id', 'title', 'author'] }
            ],
            order: [['created_at', 'DESC']],
            limit: parseInt(limit)
        });

        res.json({
            success: true,
            count: requests.length,
            requests: requests.map(r => ({
                id: r.id,
                book: r.Book,
                requested_date: r.created_at,
                due_date: r.due_date,
                approval_status: r.approval_status,
                approval_date: r.approval_date
            }))
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch borrowing requests'
        });
    }
};

// Return book
exports.returnBook = async (req, res) => {
    try {
        const { id } = req.params;
        const user_id = req.user.id;

        const borrowing = await Borrowing.findByPk(id);

        if (!borrowing || borrowing.user_id !== user_id) {
            return res.status(404).json({
                success: false,
                message: 'Borrowing record not found'
            });
        }

        // Update status
        borrowing.status = 'returned';
        borrowing.returned_date = new Date();
        await borrowing.save();

        // Update book availability
        const book = await Book.findByPk(borrowing.book_id);
        book.available_copies += 1;
        await book.save();

        res.json({
            success: true,
            message: 'Book marked as returned',
            borrowing: {
                id: borrowing.id,
                status: 'returned',
                returned_date: borrowing.returned_date
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to return book'
        });
    }
};

// Get current borrowings
exports.getCurrentBorrowings = async (req, res) => {
    try {
        const user_id = req.user.id;

        const borrowings = await Borrowing.findAll({
            where: {
                user_id,
                approval_status: 'approved',
                status: 'borrowed'
            },
            include: [
                { model: Book, attributes: ['id', 'title', 'author'] }
            ]
        });

        // Calculate days remaining
        const now = new Date();
        const withDaysLeft = borrowings.map(b => ({
            id: b.id,
            book: b.Book,
            borrowed_date: b.borrowed_date,
            due_date: b.due_date,
            days_remaining: Math.ceil((new Date(b.due_date) - now) / (1000 * 60 * 60 * 24)),
            status: b.status
        }));

        res.json({
            success: true,
            count: borrowings.length,
            borrowings: withDaysLeft
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch current borrowings'
        });
    }
};

// Get borrowing history
exports.getBorrowingHistory = async (req, res) => {
    try {
        const user_id = req.user.id;
        const { limit = 20, offset = 0 } = req.query;

        const history = await Borrowing.findAll({
            where: {
                user_id,
                status: 'returned'
            },
            include: [
                { model: Book, attributes: ['id', 'title', 'author'] }
            ],
            order: [['returned_date', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        const withDuration = history.map(b => ({
            id: b.id,
            book: b.Book,
            borrowed_date: b.borrowed_date,
            returned_date: b.returned_date,
            duration_days: Math.ceil(
                (new Date(b.returned_date) - new Date(b.borrowed_date)) / (1000 * 60 * 60 * 24)
            )
        }));

        res.json({
            success: true,
            count: history.length,
            history: withDuration
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch borrowing history'
        });
    }
};

module.exports = exports;
```

### Step 3: Create Models

```javascript
// models/Borrowing.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Borrowing = sequelize.define('Borrowing', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    book_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'books',
            key: 'id'
        }
    },
    borrowed_date: DataTypes.DATE,
    due_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    returned_date: DataTypes.DATE,
    status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected', 'borrowed', 'returned', 'overdue'),
        defaultValue: 'pending'
    },
    approval_status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending'
    },
    approved_by: {
        type: DataTypes.INTEGER,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    approval_date: DataTypes.DATE,
    rejection_reason: DataTypes.TEXT,
    reason: DataTypes.TEXT,
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'borrowings',
    timestamps: true
});

module.exports = Borrowing;
```

---

## Frontend Integration

### Step 1: Connect Admin Dashboard to API

```javascript
// In admin-dashboard.html, update loadDashboardData()
async function loadDashboardData() {
    try {
        // Load stats
        const statsResponse = await fetch('/api/borrowings/pending');
        const statsData = await statsResponse.json();
        
        document.getElementById('pendingApprovals').textContent = statsData.count;

        // Load borrowing requests
        displayBorrowingApprovals();
    } catch (error) {
        console.error('Error loading dashboard:', error);
        showAlert('Failed to load dashboard data', 'error');
    }
}

// Update approveBorrowing function
async function approveBorrowing(borrowingId) {
    try {
        const response = await fetch(`/api/borrowings/${borrowingId}/approve`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to approve borrowing');
        }

        const data = await response.json();
        showAlert('Borrowing approved!', 'success');
        loadDashboardData();
    } catch (error) {
        console.error('Error approving borrowing:', error);
        showAlert('Failed to approve borrowing', 'error');
    }
}
```

### Step 2: Connect Borrow Books Page to API

```javascript
// In borrow-books.html, update form submission
document.getElementById('borrowForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!selectedBookId) {
        showAlert('Please select a book', 'error');
        return;
    }

    try {
        const response = await fetch('/api/borrowings/request', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                book_id: selectedBookId,
                due_date: document.getElementById('dueDate').value,
                reason: document.getElementById('reason').value
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message);
        }

        showAlert('✅ Request submitted successfully!', 'success');
        document.getElementById('borrowForm').reset();
        setTimeout(() => switchTab('requests'), 1500);
    } catch (error) {
        console.error('Error submitting request:', error);
        showAlert(`Error: ${error.message}`, 'error');
    }
});
```

---

## Testing

### Test Cases to Verify

```javascript
// Test 1: Create borrowing request
POST /api/borrowings/request
{
    "book_id": 1,
    "due_date": "2024-12-24",
    "reason": "Class assignment"
}

// Expected response: 201
// Check: approval_status = 'pending'

// Test 2: Get pending requests
GET /api/borrowings/pending

// Expected: Array of pending requests

// Test 3: Approve request
PUT /api/borrowings/5/approve

// Expected: approval_status = 'approved', approved_by = user_id

// Test 4: Verify book availability decreased
GET /api/books/1

// Expected: available_copies decreased by 1

// Test 5: Return book
PUT /api/borrowings/5/return

// Expected: status = 'returned', available_copies restored
```

---

## Troubleshooting

### Common Issues

**Issue:** "Database column not found"
- **Solution:** Ensure migration ran successfully. Check database with: `DESCRIBE borrowings;`

**Issue:** "Cannot approve request" (403 error)
- **Solution:** Verify user role is 'teacher' or 'admin'. Check auth middleware.

**Issue:** Book availability not updating
- **Solution:** Ensure you're updating book available_copies in approval/return endpoints.

**Issue:** Notifications not sending
- **Solution:** Implement notification service. See notification system in API docs.

---

## Deployment Checklist

- [ ] Database migration completed
- [ ] All API endpoints implemented
- [ ] Authentication middleware in place
- [ ] Error handling added
- [ ] Notification system configured
- [ ] Frontend API calls working
- [ ] All tests passing
- [ ] Security review completed
- [ ] Load testing done
- [ ] Documentation updated


