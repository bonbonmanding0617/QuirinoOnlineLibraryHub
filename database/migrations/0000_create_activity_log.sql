-- Migration: create activity_log table (if missing)
-- This should be run before other activity_log migrations.

CREATE TABLE IF NOT EXISTS activity_log (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NULL,
  action VARCHAR(100) NOT NULL,
  description TEXT NULL,
  resource_type VARCHAR(100) NULL,
  resource_id VARCHAR(255) NULL,
  admin_ip VARCHAR(45) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_activity_log_user (user_id),
  INDEX idx_activity_log_action (action)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
