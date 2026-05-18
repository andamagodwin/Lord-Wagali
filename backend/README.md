# Lord Wagali Backend

Production API for the Lord Wagali / AlphaWins app.

## Stack

- Node.js + Express
- TypeScript
- Prisma
- PostgreSQL (Neon works well)

## Local setup

1. Copy `.env.example` to `.env`.
2. Point `DATABASE_URL` at your Neon Postgres database.
3. Run:

```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed
npm run dev
```

## Production deploy on Render

- Create a Render Web Service from this folder.
- Add `DATABASE_URL`, `APP_ORIGIN`, and `ADMIN_API_KEY` as environment variables.
- Use the included `render.yaml` or these commands:
  - Build: `npm install && npx prisma generate && npm run build`
  - Start: `npm run prisma:deploy && npm run start`

## API surface

- `GET /health`
- `GET /api/v1/tips/free`
- `GET /api/v1/tips/vip`
- `GET /api/v1/tips/history`
- `GET /api/v1/tips/:id`
- `POST /api/v1/tips`
- `PATCH /api/v1/tips/:id`
- `DELETE /api/v1/tips/:id`
- `POST /api/v1/tips/:id/settle`
- `GET /api/v1/access/me/:deviceId`
- `POST /api/v1/access/activate`
- `GET /api/v1/access/authorized`
- `POST /api/v1/access/authorize`
- `DELETE /api/v1/access/authorize/:deviceId`
