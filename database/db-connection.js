/**
 * Database Connection Module
 * Handles MySQL connection for the Online Library Hub
 * 
 * Usage:
 * const db = require('./database/db-connection');
 * const result = await db.query('SELECT * FROM users WHERE id = ?', [1]);
 */

const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'library_hub',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelayMs: 0,
};

// Create connection pool
let pool;

/**
 * Initialize database connection pool
 */
async function initializePool() {
  try {
    pool = mysql.createPool(dbConfig);
    
    // Test connection
    const connection = await pool.getConnection();
    console.log('✓ Database connected successfully');
    connection.release();
    
    return pool;
  } catch (error) {
    console.error('✗ Database connection failed:', error.message);
    process.exit(1);
  }
}

/**
 * Execute a query
 * @param {string} query - SQL query with ? placeholders
 * @param {array} values - Values to replace placeholders
 * @returns {Promise} Query result
 */
async function query(sql, values = []) {
  try {
    if (!pool) {
      await initializePool();
    }
    
    const [results] = await pool.execute(sql, values);
    return results;
  } catch (error) {
    console.error('Database query error:', error.message);
    throw error;
  }
}

/**
 * Get a single row
 * @param {string} sql - SQL query
 * @param {array} values - Query parameters
 * @returns {Promise} Single row or null
 */
async function getOne(sql, values = []) {
  const results = await query(sql, values);
  return results.length > 0 ? results[0] : null;
}

/**
 * Get multiple rows
 * @param {string} sql - SQL query
 * @param {array} values - Query parameters
 * @returns {Promise} Array of rows
 */
async function getAll(sql, values = []) {
  return await query(sql, values);
}

/**
 * Insert a record
 * @param {string} table - Table name
 * @param {object} data - Data to insert {column: value}
 * @returns {Promise} Insert result
 */
async function insert(table, data) {
  const columns = Object.keys(data);
  const values = Object.values(data);
  const placeholders = columns.map(() => '?').join(',');
  
  const sql = `INSERT INTO ${table} (${columns.join(',')}) VALUES (${placeholders})`;
  const result = await query(sql, values);
  
  return {
    insertId: result.insertId,
    affectedRows: result.affectedRows
  };
}

/**
 * Update records
 * @param {string} table - Table name
 * @param {object} data - Data to update {column: value}
 * @param {string} where - WHERE clause (e.g., 'id = ?')
 * @param {array} values - WHERE clause values
 * @returns {Promise} Update result
 */
async function update(table, data, where, values = []) {
  const sets = Object.keys(data).map(col => `${col} = ?`).join(',');
  const dataValues = Object.values(data);
  
  const sql = `UPDATE ${table} SET ${sets} WHERE ${where}`;
  const result = await query(sql, [...dataValues, ...values]);
  
  return {
    affectedRows: result.affectedRows,
    changedRows: result.changedRows
  };
}

/**
 * Delete records
 * @param {string} table - Table name
 * @param {string} where - WHERE clause
 * @param {array} values - WHERE clause values
 * @returns {Promise} Delete result
 */
async function remove(table, where, values = []) {
  const sql = `DELETE FROM ${table} WHERE ${where}`;
  const result = await query(sql, values);
  
  return {
    affectedRows: result.affectedRows
  };
}

/**
 * Start a transaction
 * @returns {Promise} Connection for transaction
 */
async function beginTransaction() {
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  return connection;
}

/**
 * Commit a transaction
 * @param {object} connection - Database connection
 */
async function commitTransaction(connection) {
  await connection.commit();
  connection.release();
}

/**
 * Rollback a transaction
 * @param {object} connection - Database connection
 */
async function rollbackTransaction(connection) {
  await connection.rollback();
  connection.release();
}

/**
 * Close the pool
 */
async function closePool() {
  if (pool) {
    await pool.end();
    console.log('Database pool closed');
  }
}

// Export functions
module.exports = {
  initializePool,
  query,
  getOne,
  getAll,
  insert,
  update,
  remove,
  beginTransaction,
  commitTransaction,
  rollbackTransaction,
  closePool,
  pool: () => pool
};



