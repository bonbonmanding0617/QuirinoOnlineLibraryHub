/**
 * API Endpoints Implementation Guide
 * Add these routes to your server.js file
 * 
 * This file serves as a reference for building REST API endpoints
 * using the database service layer (db-service.js)
 */

// ============================================
// REQUIRE STATEMENTS (Add to top of server.js)
// ============================================
require('dotenv').config();
const express = require('express');
const path = require('path');
const db = require('./database/db-connection');
const dbService = require('./database/db-service');

const app = express();

// ============================================
// MIDDLEWARE (Add after app creation)
// ============================================

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'public')));

// Error logging middleware
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ============================================
// INITIALIZE DATABASE
// ============================================
db.initializePool().catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});

// ============================================
// HTML PAGE ROUTES
// ============================================

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/student-dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'student-dashboard.html'));
});

app.get('/teacher-dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'teacher-dashboard.html'));
});

// ============================================
// BOOK API ENDPOINTS
// ============================================

/**
 * GET /api/books
 * Retrieve all books with optional filtering
 * Query params: category, search
 */
app.get('/api/books', async (req, res) => {
  try {
    const { category, search } = req.query;
    
    let books;
    if (search) {
      books = await dbService.searchBooks(search);
    } else if (category) {
      books = await dbService.getBooksByCategory(category);
    } else {
      books = await dbService.getAllBooks();
    }
    
    res.json({
      success: true,
      count: books.length,
      data: books
    });
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

/**
 * GET /api/books/:id
 * Retrieve a single book by ID
 */
app.get('/api/books/:id', async (req, res) => {
  try {
    const book = await dbService.getBookById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json({ success: true, data: book });
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).json({ error: 'Failed to fetch book' });
  }
});

/**
 * GET /api/books/available
 * Get all available books (with available_copies > 0)
 */
app.get('/api/books/available', async (req, res) => {
  try {
    const books = await dbService.getAvailableBooks();
    res.json({
      success: true,
      count: books.length,
      data: books
    });
  } catch (error) {
    console.error('Error fetching available books:', error);
    res.status(500).json({ error: 'Failed to fetch available books' });
  }
});

/**
 * POST /api/books
 * Create a new book (Teacher/Admin only)
 * Body: { title, author, isbn, category, total_copies, available_copies }
 */
app.post('/api/books', async (req, res) => {
  try {
    // TODO: Add authentication/authorization check
    const { title, author, isbn, category, total_copies, available_copies } = req.body;
    
    // Validate input
    if (!title || !author || !isbn || !category || total_copies === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const result = await dbService.createBook({
      title,
      author,
      isbn,
      category,
      total_copies,
      available_copies: available_copies || total_copies,
      created_at: new Date()
    });
    
    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      insertId: result.insertId
    });
  } catch (error) {
    console.error('Error creating book:', error);
    res.status(500).json({ error: 'Failed to create book' });
  }
});

/**
 * PUT /api/books/:id
 * Update a book (Teacher/Admin only)
 */
app.put('/api/books/:id', async (req, res) => {
  try {
    // TODO: Add authentication/authorization check
    const bookData = req.body;
    
    const result = await dbService.updateBook(req.params.id, {
      ...bookData,
      updated_at: new Date()
    });
    
    res.json({
      success: true,
      message: 'Book updated successfully',
      affectedRows: result.affectedRows
    });
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ error: 'Failed to update book' });
  }
});

/**
 * DELETE /api/books/:id
 * Delete a book (Admin only)
 */
app.delete('/api/books/:id', async (req, res) => {
  try {
    // TODO: Add authentication/authorization check
    const result = await dbService.deleteBook(req.params.id);
    
    res.json({
      success: true,
      message: 'Book deleted successfully',
      affectedRows: result.affectedRows
    });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ error: 'Failed to delete book' });
  }
});

// ============================================
// BORROWING API ENDPOINTS
// ============================================

/**
 * GET /api/users/:userId/borrowings
 * Get all books borrowed by a user
 */
app.get('/api/users/:userId/borrowings', async (req, res) => {
  try {
    const borrowings = await dbService.getUserBorrowings(req.params.userId);
    res.json({
      success: true,
      count: borrowings.length,
      data: borrowings
    });
  } catch (error) {
    console.error('Error fetching borrowings:', error);
    res.status(500).json({ error: 'Failed to fetch borrowings' });
  }
});

/**
 * GET /api/borrowings/overdue
 * Get all overdue books (Admin/Teacher only)
 */
app.get('/api/borrowings/overdue', async (req, res) => {
  try {
    const overdue = await dbService.getOverdueBooks();
    res.json({
      success: true,
      count: overdue.length,
      data: overdue
    });
  } catch (error) {
    console.error('Error fetching overdue books:', error);
    res.status(500).json({ error: 'Failed to fetch overdue books' });
  }
});

/**
 * POST /api/borrowings
 * Create a new borrowing record
 * Body: { user_id, book_id }
 */
app.post('/api/borrowings', async (req, res) => {
  try {
    const { user_id, book_id } = req.body;
    
    if (!user_id || !book_id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Check if book is available
    const book = await dbService.getBookById(book_id);
    if (!book || book.available_copies <= 0) {
      return res.status(400).json({ error: 'Book is not available' });
    }
    
    // Create borrowing record
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14); // 14-day loan period
    
    const result = await dbService.createBorrowing({
      user_id,
      book_id,
      borrowed_date: new Date(),
      due_date: dueDate,
      status: 'borrowed'
    });
    
    // Update available copies
    await dbService.updateBook(book_id, {
      available_copies: book.available_copies - 1
    });
    
    res.status(201).json({
      success: true,
      message: 'Book borrowed successfully',
      insertId: result.insertId
    });
  } catch (error) {
    console.error('Error creating borrowing:', error);
    res.status(500).json({ error: 'Failed to borrow book' });
  }
});

/**
 * PUT /api/borrowings/:id/return
 * Return a borrowed book
 */
app.put('/api/borrowings/:id/return', async (req, res) => {
  try {
    const borrowing = await dbService.getBorrowingById(req.params.id);
    if (!borrowing) {
      return res.status(404).json({ error: 'Borrowing record not found' });
    }
    
    // Update borrowing record
    const result = await dbService.returnBook(req.params.id);
    
    // Increase available copies
    const book = await dbService.getBookById(borrowing.book_id);
    await dbService.updateBook(borrowing.book_id, {
      available_copies: book.available_copies + 1
    });
    
    res.json({
      success: true,
      message: 'Book returned successfully',
      affectedRows: result.affectedRows
    });
  } catch (error) {
    console.error('Error returning book:', error);
    res.status(500).json({ error: 'Failed to return book' });
  }
});

// ============================================
// ASSIGNMENT API ENDPOINTS
// ============================================

/**
 * GET /api/assignments
 * Get all assignments (with optional filtering)
 * Query params: teacher_id, class
 */
app.get('/api/assignments', async (req, res) => {
  try {
    const { teacher_id, class: className } = req.query;
    
    let assignments;
    if (teacher_id) {
      assignments = await dbService.getTeacherAssignments(teacher_id);
    } else if (className) {
      assignments = await dbService.getClassAssignments(className);
    } else {
      // TODO: Implement getAllAssignments in db-service
      assignments = await db.getAll('SELECT * FROM assignments ORDER BY due_date DESC');
    }
    
    res.json({
      success: true,
      count: assignments.length,
      data: assignments
    });
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({ error: 'Failed to fetch assignments' });
  }
});

/**
 * GET /api/assignments/:id
 * Get a single assignment
 */
app.get('/api/assignments/:id', async (req, res) => {
  try {
    const assignment = await dbService.getAssignmentById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }
    res.json({ success: true, data: assignment });
  } catch (error) {
    console.error('Error fetching assignment:', error);
    res.status(500).json({ error: 'Failed to fetch assignment' });
  }
});

/**
 * POST /api/assignments
 * Create a new assignment (Teacher only)
 */
app.post('/api/assignments', async (req, res) => {
  try {
    // TODO: Add teacher authentication check
    const { teacher_id, title, description, book_id, due_date, class: className } = req.body;
    
    if (!teacher_id || !title || !due_date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const result = await dbService.createAssignment({
      teacher_id,
      title,
      description,
      book_id,
      due_date,
      class: className,
      created_at: new Date()
    });
    
    res.status(201).json({
      success: true,
      message: 'Assignment created successfully',
      insertId: result.insertId
    });
  } catch (error) {
    console.error('Error creating assignment:', error);
    res.status(500).json({ error: 'Failed to create assignment' });
  }
});

/**
 * PUT /api/assignments/:id
 * Update an assignment (Teacher only)
 */
app.put('/api/assignments/:id', async (req, res) => {
  try {
    // TODO: Add teacher authentication check
    const assignmentData = req.body;
    
    const result = await dbService.updateAssignment(req.params.id, {
      ...assignmentData,
      updated_at: new Date()
    });
    
    res.json({
      success: true,
      message: 'Assignment updated successfully',
      affectedRows: result.affectedRows
    });
  } catch (error) {
    console.error('Error updating assignment:', error);
    res.status(500).json({ error: 'Failed to update assignment' });
  }
});

/**
 * DELETE /api/assignments/:id
 * Delete an assignment (Teacher only)
 */
app.delete('/api/assignments/:id', async (req, res) => {
  try {
    // TODO: Add teacher authentication check
    const result = await dbService.deleteAssignment(req.params.id);
    
    res.json({
      success: true,
      message: 'Assignment deleted successfully',
      affectedRows: result.affectedRows
    });
  } catch (error) {
    console.error('Error deleting assignment:', error);
    res.status(500).json({ error: 'Failed to delete assignment' });
  }
});

// ============================================
// SUBMISSION API ENDPOINTS
// ============================================

/**
 * GET /api/assignments/:assignmentId/submissions
 * Get all submissions for an assignment (Teacher only)
 */
app.get('/api/assignments/:assignmentId/submissions', async (req, res) => {
  try {
    // TODO: Add teacher authentication check
    const submissions = await dbService.getAssignmentSubmissions(req.params.assignmentId);
    res.json({
      success: true,
      count: submissions.length,
      data: submissions
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

/**
 * POST /api/submissions
 * Submit an assignment (Student only)
 */
app.post('/api/submissions', async (req, res) => {
  try {
    // TODO: Add student authentication check
    const { assignment_id, student_id, notes } = req.body;
    
    if (!assignment_id || !student_id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const result = await dbService.createSubmission({
      assignment_id,
      student_id,
      notes,
      submitted_date: new Date(),
      status: 'submitted'
    });
    
    res.status(201).json({
      success: true,
      message: 'Assignment submitted successfully',
      insertId: result.insertId
    });
  } catch (error) {
    console.error('Error submitting assignment:', error);
    res.status(500).json({ error: 'Failed to submit assignment' });
  }
});

/**
 * PUT /api/submissions/:id/grade
 * Grade a submission (Teacher only)
 */
app.put('/api/submissions/:id/grade', async (req, res) => {
  try {
    // TODO: Add teacher authentication check
    const { score, feedback, graded_by } = req.body;
    
    if (score === undefined || score < 0 || score > 100) {
      return res.status(400).json({ error: 'Invalid score (must be 0-100)' });
    }
    
    const result = await dbService.gradeSubmission(req.params.id, score, feedback, graded_by);
    
    res.json({
      success: true,
      message: 'Submission graded successfully',
      affectedRows: result.affectedRows
    });
  } catch (error) {
    console.error('Error grading submission:', error);
    res.status(500).json({ error: 'Failed to grade submission' });
  }
});

// ============================================
// STATISTICS API ENDPOINTS
// ============================================

/**
 * GET /api/stats/library
 * Get overall library statistics
 */
app.get('/api/stats/library', async (req, res) => {
  try {
    const stats = await dbService.getLibraryStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Error fetching library stats:', error);
    res.status(500).json({ error: 'Failed to fetch library statistics' });
  }
});

/**
 * GET /api/stats/student/:userId
 * Get student statistics
 */
app.get('/api/stats/student/:userId', async (req, res) => {
  try {
    const stats = await dbService.getStudentStats(req.params.userId);
    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Error fetching student stats:', error);
    res.status(500).json({ error: 'Failed to fetch student statistics' });
  }
});

/**
 * GET /api/stats/popular-books
 * Get popular books
 */
app.get('/api/stats/popular-books', async (req, res) => {
  try {
    const limit = req.query.limit || 10;
    const books = await dbService.getPopularBooks(limit);
    res.json({ success: true, count: books.length, data: books });
  } catch (error) {
    console.error('Error fetching popular books:', error);
    res.status(500).json({ error: 'Failed to fetch popular books' });
  }
});

// ============================================
// USER API ENDPOINTS
// ============================================

/**
 * GET /api/users/:id
 * Get user information
 */
app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await dbService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Don't send password
    const { password, ...userWithoutPassword } = user;
    res.json({ success: true, data: userWithoutPassword });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

/**
 * PUT /api/users/:id
 * Update user information (User or Admin only)
 */
app.put('/api/users/:id', async (req, res) => {
  try {
    // TODO: Add authentication check
    const userData = req.body;
    
    // Don't allow changing password through this endpoint
    delete userData.password;
    
    const result = await dbService.updateUser(req.params.id, {
      ...userData,
      updated_at: new Date()
    });
    
    res.json({
      success: true,
      message: 'User updated successfully',
      affectedRows: result.affectedRows
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// ============================================
// START SERVER
// ============================================

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
  console.log(`✓ Database connected`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  await db.closePool();
  process.exit(0);
});
