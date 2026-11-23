# webdev-server

Node.js / Express HTTP server for Kambaz (CS5610, Chapter 5).

- `npm run dev` — nodemon + tsx on port 4000
- `npm start` — `tsx index.ts` (used by Render)

Environment variables (`.env` locally, Render dashboard in production):
`SERVER_ENV`, `CLIENT_URL` (comma-separated list of allowed client origins), `SERVER_URL`, `SESSION_SECRET`.
