# OctaGuard Backend 🚀

The API foundation for OctaGuard, built with Express.js and Prisma.

## 📁 Structure
- `src/server.js`: Entry point.
- `src/routes/`: API route definitions.
- `src/controllers/`: Business logic handlers.
- `src/prisma/`: Database schema and migrations.

## 🛠️ Commands
- `npm run dev`: Start development server with nodemon.
- `npm start`: Start production server.
- `npx prisma migrate dev`: Run database migrations.
- `npx prisma generate`: Regenerate Prisma client.
- `npx prisma studio`: View database via UI.

## 🏥 Health Check
`GET /api/health`
Response:
```json
{
  "status": "ok",
  "message": "OctaGuard API Running"
}
```
