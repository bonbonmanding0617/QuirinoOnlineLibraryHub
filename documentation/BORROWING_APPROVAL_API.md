# Borrowing Approval System API Documentation

## Overview
The Borrowing Approval System enables students to request books, which must be approved by teachers or administrators before the student can borrow them. This workflow ensures proper book inventory management and helps maintain a structured lending process.

## Database Schema

### Borrowings Table
```sql
CREATE TABLE borrowings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    borrowed_date DATE NOT NULL,
    due_date DATE NOT NULL,
    returned_date DATE,
    status ENUM('pending', 'approved', 'rejected', 'borrowed', 'returned', 'overdue') DEFAULT 'pending',
    approval_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    approved_by INT,
    approval_date DATETIME,
    rejection_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_book_id (book_id),
    INDEX idx_status (status),
    INDEX idx_approval_status (approval_status)
);
```

### Key Fields
- **approval_status**: Tracks the approval state (pending/approved/rejected)
- **approved_by**: User ID of the teacher/admin who approved the request
- **approval_date**: Timestamp when approval was granted
- **rejection_reason**: Text explaining why the request was rejected

## API Endpoints

### 1. Create Borrowing Request
**Endpoint:** `POST /api/borrowings/request`

**Purpose:** Student submits a request to borrow a book

**Request Body:**
```json
{
    "book_id": 1,
    "due_date": "2024-12-24",
    "reason": "For class assignment"
}
```

**Response (201 Created):**
```json
{
    "success": true,
    "message": "Borrowing request submitted",
    "borrowing": {
        "id": 5,
        "user_id": 2,
        "book_id": 1,
        "due_date": "2024-12-24",
        "status": "pending",
        "approval_status": "pending",
        "created_at": "2024-12-10T10:30:00Z"
    }
}
```

**Status Codes:**
- 201: Request created successfully
- 400: Invalid request (missing fields, book unavailable)
- 401: Unauthorized (user not logged in)
- 409: Conflict (user already has pending request for this book)

---

### 2. Get Pending Borrowing Requests
**Endpoint:** `GET /api/borrowings/pending`

**Purpose:** Teachers/admins retrieve pending requests for approval

**Query Parameters:**
- `filter` (optional): Filter by status (pending, approved, rejected)
- `class_id` (optional): Filter by class (for teachers)
- `limit` (optional): Limit results (default: 10)

**Response (200 OK):**
```json
{
    "success": true,
    "count": 2,
    "requests": [
        {
            "id": 5,
            "user": {
                "id": 2,
                "name": "John Doe",
                "email": "john@school.com",
                "class": "10-A"
            },
            "book": {
                "id": 1,
                "title": "The Great Gatsby",
                "author": "F. Scott Fitzgerald",
                "isbn": "978-0-7432-7356-5"
            },
            "requested_date": "2024-12-10",
            "due_date": "2024-12-24",
            "approval_status": "pending",
            "reason": "For class assignment",
            "created_at": "2024-12-10T10:30:00Z"
        }
    ]
}
```

---

### 3. Approve Borrowing Request
**Endpoint:** `PUT /api/borrowings/:id/approve`

**Purpose:** Teacher/admin approves a borrowing request

**Request Body:**
```json
{
    "approved_date": "2024-12-10",
    "notes": "Approved"
}
```

**Response (200 OK):**
```json
{
    "success": true,
    "message": "Borrowing request approved",
    "borrowing": {
        "id": 5,
        "approval_status": "approved",
        "approved_by": 3,
        "approval_date": "2024-12-10T14:20:00Z",
        "status": "approved"
    }
}
```

**Status Codes:**
- 200: Successfully approved
- 404: Borrowing request not found
- 400: Invalid state (already processed)
- 403: Forbidden (user not authorized to approve)

---

### 4. Reject Borrowing Request
**Endpoint:** `PUT /api/borrowings/:id/reject`

**Purpose:** Teacher/admin rejects a borrowing request

**Request Body:**
```json
{
    "rejection_reason": "Book is currently reserved for another class",
    "notes": "Please request again next week"
}
```

**Response (200 OK):**
```json
{
    "success": true,
    "message": "Borrowing request rejected",
    "borrowing": {
        "id": 5,
        "approval_status": "rejected",
        "approved_by": 3,
        "rejection_reason": "Book is currently reserved for another class",
        "approval_date": "2024-12-10T14:25:00Z",
        "status": "rejected"
    }
}
```

**Status Codes:**
- 200: Successfully rejected
- 404: Borrowing request not found
- 400: Invalid state (already processed)
- 403: Forbidden (user not authorized to reject)

---

### 5. Get Student's Borrowing Requests
**Endpoint:** `GET /api/borrowings/my-requests`

**Purpose:** Student views their own borrowing requests

**Query Parameters:**
- `status` (optional): Filter by status
- `limit` (optional): Limit results (default: 10)

**Response (200 OK):**
```json
{
    "success": true,
    "count": 3,
    "requests": [
        {
            "id": 5,
            "book": {
                "id": 1,
                "title": "The Great Gatsby",
                "author": "F. Scott Fitzgerald"
            },
            "requested_date": "2024-12-10",
            "due_date": "2024-12-24",
            "approval_status": "pending",
            "approval_date": null
        },
        {
            "id": 4,
            "book": {
                "id": 2,
                "title": "To Kill a Mockingbird",
                "author": "Harper Lee"
            },
            "requested_date": "2024-12-08",
            "due_date": "2024-12-22",
            "approval_status": "approved",
            "approval_date": "2024-12-09"
        }
    ]
}
```

---

### 6. Get Student's Currently Borrowed Books
**Endpoint:** `GET /api/borrowings/current`

**Purpose:** Student views books they are currently borrowing

**Response (200 OK):**
```json
{
    "success": true,
    "count": 2,
    "borrowings": [
        {
            "id": 4,
            "book": {
                "id": 2,
                "title": "To Kill a Mockingbird",
                "author": "Harper Lee"
            },
            "borrowed_date": "2024-12-09",
            "due_date": "2024-12-22",
            "days_remaining": 12,
            "status": "borrowed"
        }
    ]
}
```

---

### 7. Return Book
**Endpoint:** `PUT /api/borrowings/:id/return`

**Purpose:** Student marks a book as returned

**Request Body:**
```json
{
    "return_date": "2024-12-20"
}
```

**Response (200 OK):**
```json
{
    "success": true,
    "message": "Book marked as returned",
    "borrowing": {
        "id": 4,
        "status": "returned",
        "returned_date": "2024-12-20"
    }
}
```

---

### 8. Get Borrowing History
**Endpoint:** `GET /api/borrowings/history`

**Purpose:** Student views their borrowing history

**Query Parameters:**
- `limit` (optional): Limit results (default: 20)
- `offset` (optional): Pagination offset

**Response (200 OK):**
```json
{
    "success": true,
    "count": 5,
    "history": [
        {
            "id": 3,
            "book": {
                "title": "1984",
                "author": "George Orwell"
            },
            "borrowed_date": "2024-11-10",
            "returned_date": "2024-11-24",
            "duration_days": 14
        }
    ]
}
```

---

## Workflow Sequence

### Complete Borrowing Workflow
```
1. Student submits request
   - status: 'pending'
   - approval_status: 'pending'
   
2. Teacher/Admin reviews and approves
   - approval_status: 'approved'
   - approved_by: [teacher/admin ID]
   - approval_date: [current datetime]
   
3. System transitions to borrowed (once approved)
   - status: 'borrowed'
   - borrowed_date: [date issued]
   
4. Student returns book
   - status: 'returned'
   - returned_date: [return date]
```

### Rejection Workflow
```
1. Student submits request
   - status: 'pending'
   - approval_status: 'pending'
   
2. Teacher/Admin rejects request
   - approval_status: 'rejected'
   - rejection_reason: [reason text]
   - approved_by: [teacher/admin ID]
   - approval_date: [current datetime]
   
3. Student can submit new request for same book
```

---

## User Roles and Permissions

### Student Permissions
- ✅ Create borrowing request
- ✅ View own borrowing requests
- ✅ View currently borrowed books
- ✅ View borrowing history
- ✅ Return book
- ❌ Approve requests
- ❌ Reject requests

### Teacher Permissions
- ✅ View pending requests from their class
- ✅ Approve borrowing requests
- ✅ Reject borrowing requests
- ✅ View class borrowing statistics
- ❌ Create borrowing requests (see admin)
- ❌ Manage other classes

### Admin Permissions
- ✅ View all pending requests
- ✅ Approve/reject any borrowing request
- ✅ View borrowing statistics
- ✅ Access admin dashboard
- ✅ Manage book inventory
- ✅ Manage users

---

## Error Handling

### Common Error Responses

**400 Bad Request:**
```json
{
    "success": false,
    "message": "Book is not available",
    "code": "BOOK_UNAVAILABLE"
}
```

**401 Unauthorized:**
```json
{
    "success": false,
    "message": "User not authenticated",
    "code": "AUTH_REQUIRED"
}
```

**403 Forbidden:**
```json
{
    "success": false,
    "message": "User does not have permission to approve requests",
    "code": "INSUFFICIENT_PERMISSION"
}
```

**404 Not Found:**
```json
{
    "success": false,
    "message": "Borrowing request not found",
    "code": "NOT_FOUND"
}
```

**409 Conflict:**
```json
{
    "success": false,
    "message": "User already has a pending request for this book",
    "code": "DUPLICATE_REQUEST"
}
```

---

## Notification System

### Events that trigger notifications:
1. **Request Created**: Student submits borrowing request
   - Notify: Teacher, Admin
   
2. **Request Approved**: Teacher/Admin approves request
   - Notify: Student
   - Message: "Your request for [Book Title] has been approved!"
   
3. **Request Rejected**: Teacher/Admin rejects request
   - Notify: Student
   - Message: "Your request for [Book Title] was rejected: [Reason]"
   
4. **Due Date Approaching**: Book is due soon
   - Notify: Student (2 days before)
   - Message: "Your book [Title] is due on [Date]"
   
5. **Book Overdue**: Student hasn't returned book by due date
   - Notify: Student, Teacher, Admin
   - Message: "Book [Title] is overdue. Please return immediately."

---

## Validation Rules

### Borrowing Request Validation
- [ ] Book must exist and be available (copies > 0)
- [ ] Student cannot have more than 5 active borrowings
- [ ] Student cannot have pending request for the same book
- [ ] Due date must be within 30 days from today
- [ ] Due date cannot be before tomorrow
- [ ] User must be authenticated as student

### Approval Validation
- [ ] Request must be in pending status
- [ ] Admin/Teacher must be authorized
- [ ] Cannot approve already approved/rejected requests

---

## Implementation Notes

### Frontend (Pages)
- **admin-dashboard.html**: Manage all borrowing approvals, view statistics
- **teacher-dashboard.html**: Approve/reject requests from their class students
- **borrow-books.html**: Student interface for borrowing books
- **student-dashboard.html**: Links to borrowing system

### JavaScript Functions (teacher-dashboard.js)
- `approveBorrowing(borrowingId)`: Approve a borrowing request
- `rejectBorrowing(borrowingId)`: Reject a borrowing request  
- `viewBorrowingDetails(borrowingId)`: View full request details

### Backend Implementation Required
- Create API endpoints for all operations
- Implement book availability checking
- Set up notification system
- Create admin/teacher approval logic
- Implement audit logging for approvals

---

## Testing Scenarios

### Test Case 1: Successful Borrowing Flow
```
1. Student logs in
2. Navigates to "Borrow Books"
3. Searches for available book
4. Selects book and sets due date
5. Submits request
6. Teacher logs in and approves
7. System transitions book to borrowed status
8. Student views "Currently Borrowed"
9. Student returns book
10. Status changes to returned
```

### Test Case 2: Rejection Scenario
```
1. Student requests book
2. Teacher reviews and rejects (duplicate request, etc.)
3. Student receives rejection notification
4. Student can submit new request
```

### Test Case 3: Authorization Testing
```
1. Verify students cannot approve requests
2. Verify teachers can only see their class requests
3. Verify admins see all requests
4. Verify students can only see their own requests
```

---

## Future Enhancements

- [ ] Email notifications for approvals/rejections
- [ ] Automated reminder system for due dates
- [ ] Overdue fee calculation
- [ ] Book reservation system
- [ ] Bulk approval for teachers
- [ ] Advanced search filters
- [ ] Reading goals and challenges
- [ ] Book recommendations based on history

