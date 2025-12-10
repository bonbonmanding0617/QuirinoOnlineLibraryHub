-- ============================================
-- SAMPLE DATA FOR TESTING
-- ============================================
-- Insert sample users, books, and data for testing
-- ============================================

-- Insert Sample Users (Students)
INSERT INTO users (email, password, first_name, last_name, role, class) VALUES
('john.doe@school.com', 'hashed_password_1', 'John', 'Doe', 'student', '10-A'),
('jane.smith@school.com', 'hashed_password_2', 'Jane', 'Smith', 'student', '10-A'),
('mike.johnson@school.com', 'hashed_password_3', 'Mike', 'Johnson', 'student', '10-B'),
('sarah.williams@school.com', 'hashed_password_4', 'Sarah', 'Williams', 'student', '10-B'),
('alex.brown@school.com', 'hashed_password_5', 'Alex', 'Brown', 'student', '10-A');

-- Insert Sample Users (Teachers)
INSERT INTO users (email, password, first_name, last_name, role, department) VALUES
('teacher1@school.com', 'hashed_password_6', 'Sarah', 'Johnson', 'teacher', 'English Literature'),
('teacher2@school.com', 'hashed_password_7', 'David', 'Smith', 'teacher', 'History'),
('teacher3@school.com', 'hashed_password_8', 'Emma', 'Brown', 'teacher', 'Science');

-- Insert Sample Users (Admin)
INSERT INTO users (email, password, first_name, last_name, role) VALUES
('admin@school.com', 'hashed_password_9', 'Admin', 'User', 'admin');

-- Insert Sample Books
INSERT INTO books (title, author, isbn, category, description, total_copies, available_copies, published_year) VALUES
('The Great Gatsby', 'F. Scott Fitzgerald', '978-0-7432-7356-5', 'Fiction', 'A classic American novel set in the Jazz Age', 8, 3, 1925),
('To Kill a Mockingbird', 'Harper Lee', '978-0-06-112008-4', 'Fiction', 'A gripping tale of racial injustice and childhood innocence', 10, 5, 1960),
('1984', 'George Orwell', '978-0-451-52493-2', 'Fiction', 'A dystopian social science fiction novel', 6, 2, 1949),
('Sapiens', 'Yuval Noah Harari', '978-0-06-231609-7', 'Non-Fiction', 'A brief history of humankind', 5, 2, 2011),
('Educated', 'Tara Westover', '978-0-399-59097-8', 'Biography', 'A memoir about a young woman who leaves her survivalist family', 7, 4, 2018),
('Brief History of Time', 'Stephen Hawking', '978-0-553-38016-3', 'Science', 'From the Big Bang to Black Holes', 4, 1, 1988),
('The Catcher in the Rye', 'J.D. Salinger', '978-0-316-76948-0', 'Fiction', 'A story about teenage rebellion and alienation', 6, 3, 1951),
('Pride and Prejudice', 'Jane Austen', '978-0-14-143951-8', 'Fiction', 'A romantic novel of manners', 8, 5, 1813),
('The Hobbit', 'J.R.R. Tolkien', '978-0-547-92807-8', 'Fiction', 'A fantasy adventure novel', 7, 4, 1937),
('A Brief History of Nearly Everything', 'Bill Bryson', '978-0-7679-0818-4', 'Non-Fiction', 'An exploration of science, nature, and history', 5, 3, 2003);

-- Insert Sample Borrowings
INSERT INTO borrowings (user_id, book_id, borrowed_date, due_date, returned_date, status) VALUES
(1, 1, '2025-11-27', '2025-12-11', NULL, 'borrowed'),
(1, 3, '2025-12-01', '2025-12-15', NULL, 'borrowed'),
(2, 2, '2025-12-05', '2025-12-19', NULL, 'borrowed'),
(3, 4, '2025-11-20', '2025-12-04', NULL, 'overdue'),
(4, 5, '2025-12-03', '2025-12-17', NULL, 'borrowed'),
(1, 2, '2025-11-15', '2025-11-29', '2025-11-28', 'returned'),
(2, 6, '2025-11-10', '2025-11-24', '2025-11-22', 'returned');

-- Insert Sample Assignments
INSERT INTO assignments (teacher_id, title, description, book_id, due_date, class) VALUES
(6, 'Book Review: The Great Gatsby', 'Write a comprehensive review of The Great Gatsby discussing themes, characters, and writing style', 1, '2025-12-20', '10-A'),
(6, 'Character Analysis: 1984', 'Analyze the main characters in 1984 and their roles in the dystopian society', 3, '2025-12-22', '10-A'),
(6, 'Reading Summary: Sapiens', 'Summarize the key points from chapters 1-5 of Sapiens', 4, '2025-12-25', '10-B'),
(7, 'Historical Context Essay', 'Write an essay on the historical context of the 1920s as depicted in The Great Gatsby', 1, '2025-12-27', '10-A');

-- Insert Sample Submissions
INSERT INTO submissions (assignment_id, student_id, submission_text, submitted_date, status, score, feedback, graded_date, graded_by) VALUES
(1, 1, 'The Great Gatsby is a masterpiece...', '2025-12-10 14:30:00', 'graded', 95, 'Excellent analysis and well-written', '2025-12-10 16:00:00', 6),
(1, 2, 'This novel explores themes of wealth and love...', '2025-12-09 10:15:00', 'graded', 87, 'Good work, needs more character analysis', '2025-12-09 15:00:00', 6),
(2, 1, 'Winston Smith is the protagonist...', '2025-12-15 18:45:00', 'submitted', NULL, NULL, NULL, NULL),
(3, 3, 'Sapiens discusses human history...', '2025-12-18 11:20:00', 'submitted', NULL, NULL, NULL, NULL);

-- Insert Sample Reading Progress
INSERT INTO reading_progress (user_id, book_id, pages_read, total_pages, progress_percentage, started_date, rating) VALUES
(1, 1, 180, 180, 100, '2025-11-27', 5),
(1, 3, 120, 328, 36.59, '2025-12-01', NULL),
(2, 2, 281, 281, 100, '2025-12-05', 5),
(3, 4, 0, 443, 0, '2025-11-20', NULL),
(4, 5, 250, 352, 71.02, '2025-12-03', 4);

-- Insert Sample Wishlist
INSERT INTO wishlist (user_id, book_id, added_date, priority) VALUES
(1, 7, '2025-12-01 10:00:00', 1),
(1, 8, '2025-12-02 11:00:00', 2),
(2, 9, '2025-12-03 12:00:00', 1),
(3, 10, '2025-12-04 13:00:00', 1),
(4, 1, '2025-12-05 14:00:00', 2);

-- Insert Sample User Preferences
INSERT INTO user_preferences (user_id, notification_assignments, notification_due_dates, notification_recommendations, theme) VALUES
(1, TRUE, TRUE, FALSE, 'light'),
(2, TRUE, TRUE, TRUE, 'light'),
(3, TRUE, FALSE, FALSE, 'dark'),
(4, FALSE, TRUE, TRUE, 'light'),
(5, TRUE, TRUE, FALSE, 'light'),
(6, TRUE, TRUE, FALSE, 'light'),
(7, TRUE, TRUE, FALSE, 'light'),
(8, TRUE, TRUE, FALSE, 'light');

-- Insert Sample Activity Log
INSERT INTO activity_log (user_id, action, description, resource_type, resource_id) VALUES
(1, 'BORROW_BOOK', 'Borrowed The Great Gatsby', 'book', 1),
(1, 'SUBMIT_ASSIGNMENT', 'Submitted Book Review: The Great Gatsby', 'assignment', 1),
(2, 'BORROW_BOOK', 'Borrowed To Kill a Mockingbird', 'book', 2),
(3, 'VIEW_ASSIGNMENT', 'Viewed assignment: Reading Summary', 'assignment', 3),
(4, 'RETURN_BOOK', 'Returned a book', 'book', 4),
(1, 'COMPLETE_READING', 'Completed reading The Great Gatsby', 'book', 1);

-- ============================================
-- END OF SAMPLE DATA
-- ============================================

