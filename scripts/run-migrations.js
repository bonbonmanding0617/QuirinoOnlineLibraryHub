#!/usr/bin/env node
/**
 * Simple migration runner
 * - Creates a `migrations` table if missing
 * - Runs SQL files from `database/migrations` in filename order
 * - Records applied migrations to avoid re-running
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const db = require('../database/db-connection');

async function ensureMigrationsTable() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      applied_at DATETIME NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
}

async function getAppliedMigrations() {
  const rows = await db.getAll('SELECT name FROM migrations');
  return new Set(rows.map(r => r.name));
}

async function applyMigration(filePath, name) {
  const sql = fs.readFileSync(filePath, 'utf8');
  console.log(`Applying ${name} ...`);
  await db.query(sql);
  await db.insert('migrations', { name, applied_at: new Date() });
  console.log(`Applied ${name}`);
}

(async () => {
  try {
    await db.initializePool();
    await ensureMigrationsTable();

    const migrationsDir = path.join(__dirname, '..', 'database', 'migrations');
    if (!fs.existsSync(migrationsDir)) {
      console.log('No migrations directory found, nothing to run.');
      process.exit(0);
    }

    const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();
    const applied = await getAppliedMigrations();

    for (const file of files) {
      if (applied.has(file)) {
        console.log(`Skipping ${file} (already applied)`);
        continue;
      }
      const fp = path.join(migrationsDir, file);
      await applyMigration(fp, file);
    }

    console.log('Migrations finished.');
    await db.closePool();
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err.message || err);
    try { await db.closePool(); } catch (e) {}
    process.exit(1);
  }
})();
