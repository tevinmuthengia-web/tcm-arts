const { Pool } = require('pg');

const connectionString = 'postgresql://postgres.oqljsvevjzvdnoicqsvu:Muthengia2040%23@aws-1-us-west-2.pooler.supabase.com:5432/postgres';

const pool = new Pool({
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false }
});

module.exports = pool;