import nextEnv from '@next/env';
const { loadEnvConfig } = nextEnv;
import { neon } from '@neondatabase/serverless';
loadEnvConfig(process.cwd());
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is missing');
if (!process.env.ADMIN_PASSWORD_HASH || !/^\$2[aby]\$\d{2}\$/.test(process.env.ADMIN_PASSWORD_HASH)) throw new Error('A bcrypt ADMIN_PASSWORD_HASH is required');
const sql = neon(process.env.DATABASE_URL);
const statements = [
`CREATE TABLE IF NOT EXISTS jp_admin_sessions (token_hash text PRIMARY KEY, csrf text NOT NULL, expires_at timestamptz NOT NULL, created_at timestamptz NOT NULL DEFAULT now())`,
`ALTER TABLE jp_admin_sessions ADD COLUMN IF NOT EXISTS credential_version integer NOT NULL DEFAULT 1`,
`CREATE TABLE IF NOT EXISTS jp_admin_credentials (id integer PRIMARY KEY CHECK (id = 1), password_hash text NOT NULL, version integer NOT NULL DEFAULT 1, updated_at timestamptz NOT NULL DEFAULT now())`,
`CREATE TABLE IF NOT EXISTS jp_rate_limits (key text PRIMARY KEY, attempts integer NOT NULL DEFAULT 1, expires_at timestamptz NOT NULL)`,
`CREATE TABLE IF NOT EXISTS jp_content (id integer PRIMARY KEY CHECK (id = 1), texts jsonb NOT NULL DEFAULT '{}', images jsonb NOT NULL DEFAULT '{}', version integer NOT NULL DEFAULT 1, updated_at timestamptz NOT NULL DEFAULT now())`,
`ALTER TABLE jp_content ADD COLUMN IF NOT EXISTS page_media jsonb NOT NULL DEFAULT '{}'`,
`INSERT INTO jp_content (id) VALUES (1) ON CONFLICT DO NOTHING`,
`CREATE TABLE IF NOT EXISTS jp_content_draft (id integer PRIMARY KEY CHECK (id = 1), texts jsonb NOT NULL DEFAULT '{}', images jsonb NOT NULL DEFAULT '{}', page_media jsonb NOT NULL DEFAULT '{}', version integer NOT NULL DEFAULT 1, published_version integer NOT NULL, updated_at timestamptz NOT NULL DEFAULT now())`,
`INSERT INTO jp_content_draft (id, texts, images, page_media, published_version) SELECT id, texts, images, page_media, version FROM jp_content ON CONFLICT DO NOTHING`,
`CREATE TABLE IF NOT EXISTS jp_content_history (id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, kind text NOT NULL CHECK (kind IN ('draft','published')), label text NOT NULL, snapshot jsonb NOT NULL, version integer NOT NULL, created_at timestamptz NOT NULL DEFAULT now())`,
`INSERT INTO jp_content_history (kind, label, snapshot, version) SELECT 'published', 'İlk yayın', jsonb_build_object('texts', texts, 'images', images, 'pageMedia', page_media), version FROM jp_content WHERE NOT EXISTS (SELECT 1 FROM jp_content_history)`,
`CREATE TABLE IF NOT EXISTS jp_media (id uuid PRIMARY KEY, source text NOT NULL, data jsonb NOT NULL, created_at timestamptz NOT NULL DEFAULT now())`,
`CREATE TABLE IF NOT EXISTS jp_admin_events (id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, event text NOT NULL, created_at timestamptz NOT NULL DEFAULT now())`
];
for (const statement of statements) await sql.query(statement);
await sql`INSERT INTO jp_admin_credentials (id, password_hash) VALUES (1, ${process.env.ADMIN_PASSWORD_HASH}) ON CONFLICT DO NOTHING`;
console.log('Database schema ready.');
