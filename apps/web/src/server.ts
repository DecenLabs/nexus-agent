import express from 'express';
import cors from 'cors';
import queryRouter from './routes/v1/query';
import { connectDB, disconnectDB } from './utils/db';

const app: express.Application = express();

// Enable CORS
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Mount the query router at both /v1/query and /query for backward compatibility
app.use('/v1/query', queryRouter);
app.use('/query', queryRouter);

// Add a test endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 2512;

async function startServer() {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API available at http://localhost:${PORT}`);
    });

    // Handle graceful shutdown
    const shutdown = async () => {
      console.log('Shutting down server...');
      server.close(async () => {
        await disconnectDB();
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;
