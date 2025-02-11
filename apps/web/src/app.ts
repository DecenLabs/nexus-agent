import express, { Application } from 'express';
import cors from 'cors';
import v1routes from './routes/v1';
import { connectDB } from './utils/db';
import { PrismaClient } from '@prisma/client'
//import queryRouter from './routes/v1/query';

/**
 * Express application instance.
 * This is the main application object that handles all HTTP requests
 * and middleware configuration.
 * @type {Application}
 */
const app: Application = express();

/**
 * Middleware Configuration:
 * 1. express.json() - Parses incoming JSON payloads
 * 2. express.urlencoded() - Parses URL-encoded bodies
 * 3. cors() - Enables Cross-Origin Resource Sharing
 */
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
})); // Enable CORS for all routes

/**
 * API Routes:
 * Mounts all v1 routes under the base path.
 * @see ./routes/v1 for route definitions
 */
app.use(v1routes);

const prisma = new PrismaClient()

// Add this after your existing middleware setup
prisma.$connect()
  .then(() => {
    console.log('Successfully connected to database')
  })
  .catch((error) => {
    console.error('Failed to connect to database:', error)
    process.exit(1)
  })

/**
 * @exports app
 * @type {Application}
 * @description Express application instance configured with middleware and routes
 */
export default app;
