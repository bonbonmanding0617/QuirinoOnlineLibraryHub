Run & Smoke-test
````markdown
Run & Smoke-test

Quick start

1) Install dependencies

```bash
npm install
```

2) Create a `.env` file at project root with DB credentials (example):

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=library_hub
PORT=3000
```

3) Start the server (development):

```bash
npm run dev
```

4) In another terminal run the smoke tests:

```bash
npm run smoke
```

Notes:
- The smoke test script uses `BASE_URL` or `SERVER_URL` env var if set, otherwise `http://localhost:3000`.
- Ensure your MySQL server is running and the database schema includes the `users`, `books`, `borrowings`, and `activity_log` tables before running the server.
- If `npm` isn't available on your system, install Node.js 18+ from https://nodejs.org/ then rerun `npm install`.

Short local checklist (Node 18+ required):

- Install deps: `npm install`
- Create `.env` with DB credentials and `PORT` (see example above)
- Ensure MySQL is running and the DB/schema exists (run `database/init.sql` or apply migrations)
- Start server: `npm run dev`
- Run smoke tests: `npm run smoke`

Helpful commands you can run locally:

```bash
# from project root
npm install
cp .env.example .env   # edit .env with your DB creds (or create .env)
# initialize DB (optional if already applied)
# preferred: run migrations so activity_log and other tables are created
npm run migrate
# or (legacy) mysql -u root -p pedlisan < database/init.sql
npm run dev
npm run smoke
```

What the smoke script now checks:

- GET `/api/health` and `/api/borrowings/top-books?period=week`
- POST `/api/users` (register a temporary test user) and verify it appears in GET `/api/users`
- POST `/api/books` with `created_by` set to the test user (FormData)

Admin key for cleanup:

- The smoke test performs destructive cleanup by calling DELETE endpoints. These endpoints are protected by an admin API key.
- Set `ADMIN_API_KEY` in your `.env` (copy `.env.example`) before running `npm run smoke`.
- The smoke script reads `ADMIN_API_KEY` and sends it as `x-api-key` header when cleaning up.

Admin key usage and security:

- The server accepts the admin key via either `x-api-key` header or `Authorization: Bearer <key>`.
- In production (`NODE_ENV=production`) admin endpoints require HTTPS. If you need to run tests over HTTP locally, set `NODE_ENV=development` or set `ALLOW_INSECURE_ADMIN=true` in your `.env`.
- Keep `ADMIN_API_KEY` secret. Do not commit `.env` to source control.

Migrations and what to expect:

- The project includes a lightweight migration runner: `npm run migrate`.
- Migrations live in `database/migrations/` and are applied in filename order.
- `0000_create_activity_log.sql` will create the `activity_log` table for fresh databases.
- `0001_add_admin_ip.sql` (already included) adds the `admin_ip` column if missing.

Run `npm run migrate` before `npm run dev` when setting up a new database.

If any test fails, the script exits with a non-zero status and prints details.

````
