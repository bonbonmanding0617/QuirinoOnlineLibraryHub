-- ============================================
-- HELPFUL QUERIES FOR COMMON OPERATIONS
-- ============================================

-- ============================================
-- STUDENT QUERIES
-- ============================================

-- Get all books a student has borrowed (not returned)
SELECT b.id, b.title, b.author, bo.borrowed_date, bo.due_date, bo.status
FROM borrowings bo
JOIN books b ON bo.book_id = b.id
WHERE bo.user_id = ? AND bo.status IN ('borrowed', 'overdue')
ORDER BY bo.due_date ASC;

-- Get student's assignment submissions
SELECT a.id, a.title, a.due_date, s.status, s.score, s.feedback
FROM assignments a
LEFT JOIN submissions s ON a.id = s.assignment_id AND s.student_id = ?
WHERE a.class = (SELECT class FROM users WHERE id = ?)
ORDER BY a.due_date DESC;

-- Get student's reading progress
SELECT b.id, b.title, b.author, rp.pages_read, rp.total_pages, 
       ROUND((rp.pages_read / rp.total_pages) * 100, 2) as progress_percentage,
       rp.started_date, rp.completed_date, rp.rating
FROM reading_progress rp
JOIN books b ON rp.book_id = b.id
WHERE rp.user_id = ?
ORDER BY rp.updated_at DESC;

-- Get student's wishlist
SELECT b.id, b.title, b.author, b.available_copies, w.priority
FROM wishlist w
JOIN books b ON w.book_id = b.id
WHERE w.user_id = ?
ORDER BY w.priority ASC;

-- Get student dashboard statistics
SELECT 
    (SELECT COUNT(*) FROM borrowings WHERE user_id = ? AND status IN ('borrowed', 'overdue')) as books_borrowed,
    (SELECT COUNT(*) FROM borrowings WHERE user_id = ? AND status = 'overdue') as overdue_books,
    (SELECT COUNT(*) FROM submissions WHERE student_id = ? AND status = 'graded') as assignments_completed,
    (SELECT ROUND(AVG(score), 2) FROM submissions WHERE student_id = ? AND status = 'graded') as average_score;

-- ============================================
-- TEACHER QUERIES
-- ============================================

-- Get all assignments created by a teacher
SELECT id, title, description, due_date, class, created_at
FROM assignments
WHERE teacher_id = ?
ORDER BY due_date DESC;

-- Get submissions for a specific assignment
SELECT s.id, s.student_id, CONCAT(u.first_name, ' ', u.last_name) as student_name,
       s.submitted_date, s.status, s.score, s.feedback
FROM submissions s
JOIN users u ON s.student_id = u.id
WHERE s.assignment_id = ?
ORDER BY s.submitted_date DESC;

-- Get class roster with student statistics
SELECT u.id, CONCAT(u.first_name, ' ', u.last_name) as name, u.email,
       (SELECT COUNT(*) FROM borrowings WHERE user_id = u.id AND status IN ('borrowed', 'overdue')) as books_borrowed,
       (SELECT COUNT(*) FROM submissions WHERE student_id = u.id AND status = 'graded') as assignments_done,
       ROUND((SELECT AVG(score) FROM submissions WHERE student_id = u.id AND status = 'graded'), 2) as avg_score
FROM users u
WHERE u.role = 'student' AND u.class = ?
ORDER BY CONCAT(u.first_name, ' ', u.last_name);

-- Get book inventory status
SELECT id, title, author, total_copies, available_copies, 
       (total_copies - available_copies) as currently_borrowed,
       ROUND((available_copies / total_copies) * 100, 2) as availability_percentage
FROM books
ORDER BY availability_percentage ASC;

-- Get overdue books
SELECT b.id, b.title, u.first_name, u.last_name, bo.borrowed_date, bo.due_date,
       DATEDIFF(CURDATE(), bo.due_date) as days_overdue
FROM borrowings bo
JOIN books b ON bo.book_id = b.id
JOIN users u ON bo.user_id = u.id
WHERE bo.status = 'overdue'
ORDER BY bo.due_date ASC;

-- Get assignment submission statistics
SELECT a.title, a.due_date,
       (SELECT COUNT(*) FROM submissions WHERE assignment_id = a.id AND status = 'graded') as graded_count,
       (SELECT COUNT(*) FROM submissions WHERE assignment_id = a.id AND status = 'submitted') as pending_count,
       (SELECT COUNT(*) FROM assignments_students WHERE assignment_id = a.id) as total_students
FROM assignments a
WHERE a.teacher_id = ?
ORDER BY a.due_date DESC;

-- Get class performance report
SELECT u.class,
       COUNT(DISTINCT u.id) as total_students,
       ROUND(AVG(b.books_borrowed), 2) as avg_books_borrowed,
       ROUND(AVG(s.avg_score), 2) as class_average_score
FROM users u
LEFT JOIN (
    SELECT user_id, COUNT(*) as books_borrowed 
    FROM borrowings 
    WHERE status IN ('borrowed', 'overdue') 
    GROUP BY user_id
) b ON u.id = b.user_id
LEFT JOIN (
    SELECT student_id, AVG(score) as avg_score 
    FROM submissions 
    WHERE status = 'graded' 
    GROUP BY student_id
) s ON u.id = s.student_id
WHERE u.role = 'student' AND u.class = ?
GROUP BY u.class;

-- ============================================
-- BOOK MANAGEMENT QUERIES
-- ============================================

-- Get popular books (most borrowed)
SELECT b.id, b.title, b.author, COUNT(bo.id) as times_borrowed
FROM books b
LEFT JOIN borrowings bo ON b.id = bo.book_id
GROUP BY b.id
ORDER BY times_borrowed DESC
LIMIT 10;

-- Get books by category
SELECT id, title, author, isbn, available_copies, total_copies
FROM books
WHERE category = ?
ORDER BY title ASC;

-- Search books
SELECT id, title, author, category, available_copies
FROM books
WHERE title LIKE ? OR author LIKE ? OR isbn LIKE ?
ORDER BY title ASC;

-- Get available books
SELECT id, title, author, category, available_copies
FROM books
WHERE available_copies > 0
ORDER BY title ASC;

-- ============================================
-- STATISTICS QUERIES
-- ============================================

-- Get overall library statistics
SELECT 
    (SELECT COUNT(*) FROM books) as total_books,
    (SELECT SUM(available_copies) FROM books) as available_books,
    (SELECT SUM(total_copies - available_copies) FROM books) as currently_borrowed,
    (SELECT COUNT(DISTINCT user_id) FROM borrowings) as students_who_borrowed,
    (SELECT COUNT(*) FROM assignments) as total_assignments,
    (SELECT COUNT(*) FROM submissions WHERE status = 'graded') as graded_assignments;

-- Get most active readers
SELECT u.id, CONCAT(u.first_name, ' ', u.last_name) as name,
       COUNT(DISTINCT rp.book_id) as books_read,
       ROUND(AVG(rp.rating), 2) as avg_rating
FROM users u
JOIN reading_progress rp ON u.id = rp.user_id
WHERE rp.completed_date IS NOT NULL
GROUP BY u.id
ORDER BY books_read DESC
LIMIT 10;

-- Get reading trends by category
SELECT b.category, 
       COUNT(rp.id) as total_reads,
       COUNT(DISTINCT rp.user_id) as unique_readers,
       ROUND(AVG(rp.rating), 2) as avg_rating
FROM reading_progress rp
JOIN books b ON rp.book_id = b.id
GROUP BY b.category
ORDER BY total_reads DESC;

-- Get monthly borrowing statistics
SELECT 
    YEAR(borrowed_date) as year,
    MONTH(borrowed_date) as month,
    COUNT(*) as borrowing_count
FROM borrowings
GROUP BY YEAR(borrowed_date), MONTH(borrowed_date)
ORDER BY year DESC, month DESC;

-- ============================================
-- MAINTENANCE QUERIES
-- ============================================

-- Update available copies when book is borrowed
UPDATE books SET available_copies = available_copies - 1 WHERE id = ?;

-- Update available copies when book is returned
UPDATE books SET available_copies = available_copies + 1 WHERE id = ?;

-- Mark overdue borrowings
UPDATE borrowings 
SET status = 'overdue' 
WHERE status = 'borrowed' AND due_date < CURDATE();

-- Get books with low availability
SELECT id, title, author, available_copies, total_copies,
       ROUND((available_copies / total_copies) * 100, 2) as availability_percentage
FROM books
WHERE available_copies < (total_copies * 0.3)
ORDER BY availability_percentage ASC;

-- Archive old data (example: completed borrowings older than 1 year)
-- This is a safe query to identify records to archive
SELECT * FROM borrowings 
WHERE status = 'returned' AND returned_date < DATE_SUB(CURDATE(), INTERVAL 1 YEAR);

-- Get user activity summary
SELECT user_id, action, COUNT(*) as count
FROM activity_log
WHERE created_at > DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY user_id, action
ORDER BY user_id, count DESC;

-- ============================================
-- END OF HELPFUL QUERIES
-- ============================================
