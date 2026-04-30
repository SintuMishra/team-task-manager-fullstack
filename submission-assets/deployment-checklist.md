# Deployment Checklist

- Confirm `npm install` completes successfully
- Confirm `npm run build` completes successfully
- Confirm `npm run prisma:migrate` completes successfully against the target database
- Confirm `node --check server/src/index.js` passes
- Confirm `.env`, `server/.env`, and `client/.env` are not committed
- Confirm `node_modules` and `dist` folders are not committed
- Create a Railway PostgreSQL service
- Set `DATABASE_URL`
- Set `JWT_SECRET`
- Set `FRONTEND_URL` to the deployed app origin
- Set `NODE_ENV=production`
- Allow Railway to inject `PORT`, or define it explicitly if needed
- Start the service with `npm run start`
- Verify `GET /api/health`
- Verify admin login
- Verify member login
- Verify dashboard data loads
- Verify frontend assets are served correctly from the deployed service
