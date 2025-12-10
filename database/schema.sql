-- ============================================
-- ONLINE LIBRARY HUB - DATABASE SCHEMA
-- ============================================
-- This SQL file creates the complete database structure
-- for the Online Library Hub application
-- ============================================

-- Create Users Table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role ENUM('student', 'teacher', 'admin') NOT NULL,
    class VARCHAR(50),
    department VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Books Table
CREATE TABLE books (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(20) UNIQUE,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    total_copies INT DEFAULT 1,
    available_copies INT DEFAULT 1,
    published_year INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Book Borrowings Table
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

-- Create Assignments Table
CREATE TABLE assignments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    teacher_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    book_id INT,
    due_date DATE NOT NULL,
    class VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE SET NULL,
    INDEX idx_teacher_id (teacher_id),
    INDEX idx_class (class)
);

-- Create Assignment Submissions Table
CREATE TABLE submissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    assignment_id INT NOT NULL,
    student_id INT NOT NULL,
    submission_text TEXT,
    submission_file VARCHAR(255),
    submitted_date DATETIME,
    status ENUM('pending', 'submitted', 'graded') DEFAULT 'pending',
    score INT,
    feedback TEXT,
    graded_date DATETIME,
    graded_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (graded_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_assignment_id (assignment_id),
    INDEX idx_student_id (student_id),
    INDEX idx_status (status)
);

-- Create Reading Progress Table
CREATE TABLE reading_progress (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    pages_read INT DEFAULT 0,
    total_pages INT,
    progress_percentage DECIMAL(5, 2) DEFAULT 0,
    started_date DATE,
    completed_date DATE,
    rating INT,
    review TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_book_id (book_id)
);

-- Create Wishlist Table
CREATE TABLE wishlist (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    added_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    priority INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    UNIQUE KEY unique_wishlist (user_id, book_id),
    INDEX idx_user_id (user_id),
    INDEX idx_book_id (book_id)
);

-- Create Notifications Table
CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    related_id INT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_is_read (is_read)
);

-- Create Activity Log Table
CREATE TABLE activity_log (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    action VARCHAR(100) NOT NULL,
    description TEXT,
    resource_type VARCHAR(100),
    resource_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_action (action),
    INDEX idx_created_at (created_at)
);

-- Create Preferences Table
CREATE TABLE user_preferences (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL UNIQUE,
    notification_assignments BOOLEAN DEFAULT TRUE,
    notification_due_dates BOOLEAN DEFAULT TRUE,
    notification_recommendations BOOLEAN DEFAULT FALSE,
    notification_announcements BOOLEAN DEFAULT TRUE,
    theme VARCHAR(50) DEFAULT 'light',
    language VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX idx_books_category ON books(category);
CREATE INDEX idx_books_author ON books(author);
CREATE INDEX idx_borrowings_user_status ON borrowings(user_id, status);
CREATE INDEX idx_borrowings_due_date ON borrowings(due_date);
CREATE INDEX idx_assignments_due_date ON assignments(due_date);
CREATE INDEX idx_submissions_status ON submissions(status);

-- ============================================
-- END OF SCHEMA
-- ============================================

