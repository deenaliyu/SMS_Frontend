# Scholastify360 Frontend

This project is the frontend for the School Management System (SMS).

## Why you were getting CORS errors

Your frontend runs on a different origin than your backend (`localhost:5173` vs backend port `1000`).
The browser blocks cross-origin API calls unless backend CORS headers are correctly configured.

## Frontend fix applied

I configured Vite dev proxy and switched frontend API base to relative `/api`, so in development requests are same-origin to the browser:

- Frontend calls: `/api/...`
- Vite proxies to backend target: `http://127.0.0.1:1000`

To match backends that expose routes without `/api` (for example `/notices`), proxy rewrite now strips `/api` by default.

Updated files:

- `vite.config.js`
- `src/services/apiClient.js`
- `.env` and `.env.example`

## Environment setup

```bash
VITE_API_BASE_URL=/api
VITE_API_PROXY_TARGET=http://127.0.0.1:1000
VITE_API_PROXY_KEEP_PREFIX=false
```

- `VITE_API_PROXY_KEEP_PREFIX=false` (default): `/api/notices` -> backend `/notices`
- `VITE_API_PROXY_KEEP_PREFIX=true`: `/api/notices` -> backend `/api/notices`

Then restart dev server:

```bash
npm run dev
```

## Note about 0.0.0.0

`0.0.0.0` is a bind address for servers. For client/proxy target, use `127.0.0.1` or `localhost`.

## API Service Layer

Backend calls are centralized in:

- `src/services/apiClient.js`
- `src/services/smsApi.js`

Configured endpoints currently used by the UI:

- `POST /auth/login`
- `POST /admissions`
- `POST /students/register`
- `POST /teachers`
- `POST /parents`
- `POST /events`
- `POST /notices`
- `POST /admin-users`

If a route is missing or backend is unavailable, form submissions are now queued locally via offline fallback instead of crashing the page.

## Production note

In production, CORS must still be allowed by backend server configuration if frontend and backend are on different domains.
