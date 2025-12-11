#!/usr/bin/env node
require('dotenv').config();
const mysql = require('mysql2/promise');
(async ()=>{
  try{
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });
    const name = process.argv[2] || '0001_add_admin_ip.sql';
    await conn.query('INSERT INTO migrations (name, applied_at) VALUES (?, NOW())', [name]);
    console.log('Marked', name, 'as applied');
    await conn.end();
    process.exit(0);
  }catch(e){
    console.error('Failed to mark migration:', e.message || e);
    process.exit(1);
  }
})();
