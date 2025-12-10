/**
 * Database Service Layer
 * Provides reusable functions for common database operations
 */

const db = require('./db-connection');

// ============================================
// USER QUERIES
// ============================================

async function getUserById(id) {
  return await db.getOne('SELECT * FROM users WHERE id = ?', [id]);
}

async function getUserByEmail(email) {
  return await db.getOne('SELECT * FROM users WHERE email = ?', [email]);
}

async function getAllStudents() {
  return await db.getAll('SELECT * FROM users WHERE role = ?', ['student']);
}

async function getStudentsByClass(className) {
  return await db.getAll('SELECT * FROM users WHERE role = ? AND class = ?', ['student', className]);
}

async function getAllTeachers() {
  return await db.getAll('SELECT * FROM users WHERE role = ?', ['teacher']);
}

async function createUser(userData) {
  return await db.insert('users', userData);
}

async function updateUser(id, userData) {
  return await db.update('users', userData, 'id = ?', [id]);
}

// ============================================
// BOOK QUERIES
// ============================================

async function getBookById(id) {
  return await db.getOne('SELECT * FROM books WHERE id = ?', [id]);
}

async function getAllBooks() {
  return await db.getAll('SELECT * FROM books ORDER BY title ASC');
}

async function getBooksByCategory(category) {
  return await db.getAll('SELECT * FROM books WHERE category = ? ORDER BY title ASC', [category]);
}

async function searchBooks(searchTerm) {
  const term = `%${searchTerm}%`;
  return await db.getAll(
    'SELECT * FROM books WHERE title LIKE ? OR author LIKE ? OR isbn LIKE ? ORDER BY title ASC',
    [term, term, term]
  );
}

async function getAvailableBooks() {
  return await db.getAll('SELECT * FROM books WHERE available_copies > 0 ORDER BY title ASC');
}

async function createBook(bookData) {
  return await db.insert('books', bookData);
}

async function updateBook(id, bookData) {
  return await db.update('books', bookData, 'id = ?', [id]);
}

async function deleteBook(id) {
  return await db.remove('books', 'id = ?', [id]);
}

// ============================================
// BORROWING QUERIES
// ============================================

async function getBorrowingById(id) {
  return await db.getOne('SELECT * FROM borrowings WHERE id = ?', [id]);
}

async function getUserBorrowings(userId) {
  return await db.getAll(
    'SELECT b.*, bo.title, bo.author FROM borrowings b JOIN books bo ON b.book_id = bo.id WHERE b.user_id = ? AND b.status IN (?, ?) ORDER BY b.due_date ASC',
    [userId, 'borrowed', 'overdue']
  );
}

async function getOverdueBooks() {
  return await db.getAll(
    'SELECT b.*, bo.title, bo.author, u.first_name, u.last_name FROM borrowings b JOIN books bo ON b.book_id = bo.id JOIN users u ON b.user_id = u.id WHERE b.status = ? ORDER BY b.due_date ASC',
    ['overdue']
  );
}

async function createBorrowing(borrowingData) {
  return await db.insert('borrowings', borrowingData);
}

async function returnBook(borrowingId) {
  return await db.update('borrowings', { status: 'returned', returned_date: new Date() }, 'id = ?', [borrowingId]);
}

async function markOverdueBooks() {
  return await db.query(
    'UPDATE borrowings SET status = ? WHERE status = ? AND due_date < CURDATE()',
    ['overdue', 'borrowed']
  );
}

// ============================================
// ASSIGNMENT QUERIES
// ============================================

async function getAssignmentById(id) {
  return await db.getOne('SELECT * FROM assignments WHERE id = ?', [id]);
}

async function getTeacherAssignments(teacherId) {
  return await db.getAll('SELECT * FROM assignments WHERE teacher_id = ? ORDER BY due_date DESC', [teacherId]);
}

async function getClassAssignments(className) {
  return await db.getAll('SELECT * FROM assignments WHERE class = ? ORDER BY due_date DESC', [className]);
}

async function createAssignment(assignmentData) {
  return await db.insert('assignments', assignmentData);
}

async function updateAssignment(id, assignmentData) {
  return await db.update('assignments', assignmentData, 'id = ?', [id]);
}

async function deleteAssignment(id) {
  return await db.remove('assignments', 'id = ?', [id]);
}

// ============================================
// SUBMISSION QUERIES
// ============================================

async function getSubmissionById(id) {
  return await db.getOne('SELECT * FROM submissions WHERE id = ?', [id]);
}

async function getAssignmentSubmissions(assignmentId) {
  return await db.getAll(
    'SELECT s.*, u.first_name, u.last_name FROM submissions s JOIN users u ON s.student_id = u.id WHERE s.assignment_id = ? ORDER BY s.submitted_date DESC',
    [assignmentId]
  );
}

async function getStudentSubmission(assignmentId, studentId) {
  return await db.getOne(
    'SELECT * FROM submissions WHERE assignment_id = ? AND student_id = ?',
    [assignmentId, studentId]
  );
}

async function createSubmission(submissionData) {
  return await db.insert('submissions', submissionData);
}

async function updateSubmission(id, submissionData) {
  return await db.update('submissions', submissionData, 'id = ?', [id]);
}

async function gradeSubmission(id, score, feedback, gradedBy) {
  return await db.update('submissions', {
    score,
    feedback,
    status: 'graded',
    graded_date: new Date(),
    graded_by: gradedBy
  }, 'id = ?', [id]);
}

// ============================================
// READING PROGRESS QUERIES
// ============================================

async function getReadingProgress(userId, bookId) {
  return await db.getOne(
    'SELECT * FROM reading_progress WHERE user_id = ? AND book_id = ?',
    [userId, bookId]
  );
}

async function getUserReadingProgress(userId) {
  return await db.getAll(
    'SELECT rp.*, b.title, b.author FROM reading_progress rp JOIN books b ON rp.book_id = b.id WHERE rp.user_id = ? ORDER BY rp.updated_at DESC',
    [userId]
  );
}

async function updateReadingProgress(userId, bookId, progressData) {
  const existing = await getReadingProgress(userId, bookId);
  if (existing) {
    return await db.update('reading_progress', progressData, 'user_id = ? AND book_id = ?', [userId, bookId]);
  } else {
    return await db.insert('reading_progress', {
      user_id: userId,
      book_id: bookId,
      ...progressData
    });
  }
}

// ============================================
// STATISTICS QUERIES
// ============================================

async function getStudentStats(userId) {
  const stats = await db.getOne(
    `SELECT 
      (SELECT COUNT(*) FROM borrowings WHERE user_id = ? AND status IN ('borrowed', 'overdue')) as books_borrowed,
      (SELECT COUNT(*) FROM borrowings WHERE user_id = ? AND status = 'overdue') as overdue_books,
      (SELECT COUNT(*) FROM submissions WHERE student_id = ? AND status = 'graded') as assignments_completed,
      (SELECT ROUND(AVG(score), 2) FROM submissions WHERE student_id = ? AND status = 'graded') as average_score`,
    [userId, userId, userId, userId]
  );
  return stats;
}

async function getLibraryStats() {
  return await db.getOne(
    `SELECT 
      (SELECT COUNT(*) FROM books) as total_books,
      (SELECT SUM(available_copies) FROM books) as available_books,
      (SELECT SUM(total_copies - available_copies) FROM books) as currently_borrowed,
      (SELECT COUNT(*) FROM assignments) as total_assignments,
      (SELECT COUNT(*) FROM submissions WHERE status = 'graded') as graded_assignments`
  );
}

async function getPopularBooks(limit = 10) {
  return await db.getAll(
    `SELECT b.id, b.title, b.author, COUNT(bo.id) as times_borrowed
    FROM books b
    LEFT JOIN borrowings bo ON b.id = bo.book_id
    GROUP BY b.id
    ORDER BY times_borrowed DESC
    LIMIT ?`,
    [limit]
  );
}

// ============================================
// EXPORT ALL FUNCTIONS
// ============================================

module.exports = {
  // User functions
  getUserById,
  getUserByEmail,
  getAllStudents,
  getStudentsByClass,
  getAllTeachers,
  createUser,
  updateUser,
  
  // Book functions
  getBookById,
  getAllBooks,
  getBooksByCategory,
  searchBooks,
  getAvailableBooks,
  createBook,
  updateBook,
  deleteBook,
  
  // Borrowing functions
  getBorrowingById,
  getUserBorrowings,
  getOverdueBooks,
  createBorrowing,
  returnBook,
  markOverdueBooks,
  
  // Assignment functions
  getAssignmentById,
  getTeacherAssignments,
  getClassAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  
  // Submission functions
  getSubmissionById,
  getAssignmentSubmissions,
  getStudentSubmission,
  createSubmission,
  updateSubmission,
  gradeSubmission,
  
  // Reading progress functions
  getReadingProgress,
  getUserReadingProgress,
  updateReadingProgress,
  
  // Statistics functions
  getStudentStats,
  getLibraryStats,
  getPopularBooks
};



