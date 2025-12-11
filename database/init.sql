-- ============================================
-- DATABASE SETUP AND INITIALIZATION
-- ============================================
-- Quick setup script to initialize the database
-- Run this script in MySQL to set everything up
-- ============================================

-- Create Database
CREATE DATABASE IF NOT EXISTS library_hub;
USE library_hub;

-- Set Character Set
ALTER DATABASE library_hub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Enable Foreign Keys
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- Now run the schema.sql file to create tables
-- Then run sample-data.sql to insert sample data
-- ============================================

-- Verify installation
SHOW TABLES;

-- Check row counts
SELECT 
    'users' as table_name, COUNT(*) as row_count FROM users
UNION ALL
SELECT 'books', COUNT(*) FROM books
UNION ALL
SELECT 'borrowings', COUNT(*) FROM borrowings
UNION ALL
SELECT 'assignments', COUNT(*) FROM assignments
UNION ALL
SELECT 'submissions', COUNT(*) FROM submissions
UNION ALL
SELECT 'reading_progress', COUNT(*) FROM reading_progress
UNION ALL
SELECT 'wishlist', COUNT(*) FROM wishlist
UNION ALL
SELECT 'activity_log', COUNT(*) FROM activity_log;

-- Ensure activity_log has admin_ip column (nullable)
-- This will be a no-op if column already exists in newer schemas.
ALTER TABLE activity_log
    ADD COLUMN IF NOT EXISTS admin_ip VARCHAR(45) NULL AFTER resource_id;

-- ============================================
-- END OF INITIALIZATION
-- ============================================

