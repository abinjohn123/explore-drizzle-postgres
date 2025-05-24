import express, { Request } from 'express';
import cors from 'cors';

import usersRouter from '../db/routes/users.routes';
import exercisesRouter from '../db/routes/exercises.routes';
import workoutsRouter from '../db/routes/workouts.routes';

// Dynamic configuration for local vs production
const isDevelopment = process.env.NODE_ENV !== 'production';
const PORT = Number(process.env.PORT) || 8008;

// Import LOCAL_IP only in development
let LOCAL_IP: string = 'localhost';
if (isDevelopment) {
  try {
    const localConfig = require('../../local.config');
    LOCAL_IP = localConfig.LOCAL_IP;
  } catch (error) {
    console.log('⚠️ local.config not found, using localhost');
  }
}

const HOST = isDevelopment ? LOCAL_IP : '0.0.0.0';

const app = express();

// CORS configuration
const corsOptions = {
  origin: isDevelopment
    ? [`http://${LOCAL_IP}:3001`]
    : [
        process.env.FRONTEND_URL ?? '',
        'https://your-frontend-domain.vercel.app',
      ].filter(Boolean), // Remove undefined values
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(express.json());
app.use(cors(corsOptions));

// Health check endpoint (useful for Railway)
app.get('/health', (_, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    port: PORT,
    host: HOST,
  });
});

// API routes
app.use('/users', usersRouter);
app.use('/exercises', exercisesRouter);
app.use('/workouts', workoutsRouter);

// Root endpoint with helpful info
app.get('/', (_, res) => {
  res.json({
    message: 'Workout Tracker API',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      health: '/health',
      users: '/users',
      exercises: '/exercises',
      workouts: '/workouts',
    },
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use('*', (_, res) => {
  res.status(404).json({
    error: 'Route not found',
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, HOST, () => {
  console.log(`Server running on ${HOST}:${PORT}\n`);

  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Health check: http://${HOST}:${PORT}/health\n`);

  if (isDevelopment) {
    console.log(`Local development mode`);
    console.log(`Frontend should connect to: http://${HOST}:${PORT}`);
  } else {
    console.log(`Production mode`);
    console.log(`CORS enabled for: ${corsOptions.origin}`);
  }
});

export default app;
