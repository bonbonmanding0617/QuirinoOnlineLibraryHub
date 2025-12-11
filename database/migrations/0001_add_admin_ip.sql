-- Migration: add admin_ip to activity_log
-- Run this on your MySQL database before starting the server.

ALTER TABLE activity_log
  ADD COLUMN IF NOT EXISTS admin_ip VARCHAR(45) NULL AFTER resource_id;

-- Optional: add an index if you expect to query by admin_ip
-- CREATE INDEX idx_activity_log_admin_ip ON activity_log(admin_ip);
