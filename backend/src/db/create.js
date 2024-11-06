import pgtools from 'pgtools'
import * as db from './index.js'
const { createdb, dropdb } = pgtools

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT
}
try {
  await dropdb(config, process.env.DB_NAME).catch((error) => {
    console.log('dropdb error', error)
  })
  await createdb(config, process.env.DB_NAME).then((res) => {
    console.log('createdb res', res)
    // seed
    db.query(`
      CREATE EXTENSION pgcrypto WITH SCHEMA public;
      CREATE TABLE merchants (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        category VARCHAR(255) NOT NULL,
        logo VARCHAR(255) NOT NULL
      );
      CREATE TABLE sessions (
        "sid" varchar NOT NULL COLLATE "default",
        "sess" json NOT NULL,
        "expire" timestamp(6) NOT NULL
      )
        WITH (OIDS=FALSE);
        ALTER TABLE "sessions" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
        CREATE INDEX "IDX_session_expire" ON "sessions" ("expire");

      CREATE TABLE split_transactions (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        transaction_id uuid NOT NULL,
        members uuid[],
        date_created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );

      CREATE TABLE transactions (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        payer_id uuid NOT NULL,
        split_id uuid NULL UNIQUE,
        merchant_id uuid NOT NULL,
        price NUMERIC(7,2) NOT NULL,
        notes VARCHAR(1024),
        shared BOOL NOT NULL DEFAULT FALSE,
        receipt VARCHAR(2048),
        currency TEXT CHECK (currency IN ('USD', 'CAD', 'GBP')),
        payment_type TEXT CHECK (payment_type IN ('POS', 'ONLINE')),
        date_created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );

      CREATE TABLE users (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255),
        email VARCHAR(255) NOT NULL UNIQUE,	
        date_created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        date_last_login TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );

      -- seed merchants
      INSERT INTO merchants (name, category, logo)
      VALUES ('Starbucks', 'Coffee & Snacks', 'starbucks.svg'), ('McDonalds', 'Dining Out', 'mcdonalds.svg'), ('Best Buy', 'Electronics', 'bestbuy.svg'), ('Amazon', 'Online Shopping', 'amazon.svg'), ('Earls', 'Dinning Out', 'earls.png'), ('Pret A Manger', 'Coffee & Snacks', 'pretamanger.png');

      -- seed users
      INSERT INTO users (name, email, id)
      VALUES ('Jerry', 'jerry@example.com', 'fe389b85-b17d-4b81-9ffd-0b73ff0af300'), ('George', 'george@example.com', '14997873-12b2-4fd2-8aad-f2b42a7be1a6');
      `
    )
  }).catch((error) => {
    console.log('createdb error', error)
  })
} catch (error) {
  console.log('error', error)
}