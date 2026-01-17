const { Pool } = require('pg');
const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

let query;

if (process.env.NODE_ENV === 'production') {
    // Optimized for Neon in the cloud (Serverless)
    const sql = neon(process.env.DATABASE_URL);
    
    // We wrap it in an object to keep it compatible with your existing code
    query = {
        query: (text, params) => sql(text, params)
    };
} else {
    // Standard Pool for your local PostgreSQL/Development
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
    });
    query = pool;
}

module.exports = query;