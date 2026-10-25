import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

// Connect to Database
await connectDB();

const server = app.listen(PORT, () => {
  console.log(`[Server] CareerTech Backend running on http://localhost:${PORT}`);
  console.log(`[Server] Environment: ${process.env.NODE_ENV || 'development'}`);
});

process.on('unhandledRejection', (err) => {
  console.error(`[Unhandled Rejection]:`, err?.message || err);
});

process.on('uncaughtException', (err) => {
  console.error(`[Uncaught Exception]:`, err?.message || err);
});
