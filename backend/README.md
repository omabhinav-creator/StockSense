# StockSense backend

1. Install Node.js 18+ and PostgreSQL 14+.
2. Create a database named `stocksense`.
3. Run `psql -U postgres -d stocksense -f ../database.sql` from this folder.
4. Copy `.env.example` to `.env` and set your local PostgreSQL password in `DATABASE_URL` plus a private `JWT_SECRET`.
5. Run `npm install`, then `npm start`.
6. Open `../pages/login.html` through VS Code Live Server (or another static HTTP server). The API listens on `http://localhost:5000`.

Demo login (seeded password `password`): `manager@stocksense.demo` or `staff@stocksense.demo`.

The OTP endpoint returns `demoOtp` in development mode. No email or SMS is sent. The API includes auth, dashboard, receipts, deliveries, transfers, stock ledger, and adjustment endpoints. Receipt, delivery, and transfer status changes apply stock and ledger changes transactionally when set to `done`.
