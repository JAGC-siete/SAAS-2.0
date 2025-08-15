#!/usr/bin/env node
/* eslint-disable */
const fs = require('fs');
const path = require('path');
const pg = require('pg');

const { Client } = pg;
const MIGRATIONS_DIR = path.resolve(process.cwd(), 'infra/migrations');

async function run() {
  const databaseUrl = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('Missing SUPABASE_DB_URL or DATABASE_URL');
    process.exit(1);
  }
  const client = new Client({ connectionString: databaseUrl });
  await client.connect();
  await client.query('create table if not exists _migrations (id text primary key, applied_at timestamptz default now())');

  const files = fs.readdirSync(MIGRATIONS_DIR).filter(f => f.endsWith('.sql')).sort();
  for (const file of files) {
    if (file === 'run.js') continue;
    const id = file;
    const exists = await client.query('select 1 from _migrations where id = $1', [id]);
    if (exists.rowCount) continue;
    const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');
    console.log('Applying', id);
    await client.query('begin');
    try {
      await client.query(sql);
      await client.query('insert into _migrations(id) values ($1)', [id]);
      await client.query('commit');
    } catch (e) {
      await client.query('rollback');
      console.error('Failed migration', id, e);
      process.exit(1);
    }
  }
  await client.end();
  console.log('Migrations complete');
}
run().catch(e => { console.error(e); process.exit(1); });