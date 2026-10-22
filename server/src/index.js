import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import studentsRouter from './routes/students.js';
import coursesRouter from './routes/courses.js';
import enrollmentsRouter from './routes/enrollments.js';
import { notFound, errorHandler } from './middleware/errors.js';

const app = express();
app.disable('x-powered-by');
app.use(helmet());
const origins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173').split(',').map(v => v.trim());
app.use(cors({ origin: (origin, callback) => {
  if (!origin || origins.includes('*') || origins.includes(origin)) return callback(null, true);
  return callback(new Error('Origin is not allowed by CORS.'));
} }));
app.use(express.json({ limit: '100kb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: 'draft-7', legacyHeaders: false }));
app.get('/api/health', (req, res) => res.json({ success: true, message: 'CampusConnect API is running.', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' }));
app.get('/api/dashboard', async (req, res, next) => {
  try {
    const Student = (await import('./models/Student.js')).default;
    const Course = (await import('./models/Course.js')).default;
    const Enrollment = (await import('./models/Enrollment.js')).default;
    const [students, courses, enrollments, activeEnrollments, departments, recent] = await Promise.all([
      Student.countDocuments(), Course.countDocuments(), Enrollment.countDocuments(), Enrollment.countDocuments({ status: 'Enrolled' }),
      Student.distinct('department'), Enrollment.find().sort({ createdAt: -1 }).limit(5).populate('student', 'name rollNumber').populate('course', 'title courseCode')
    ]);
    res.json({ success: true, data: { students, courses, enrollments, activeEnrollments, departments: departments.length, recent } });
  } catch (err) { next(err); }
});
app.use('/api/students', studentsRouter);
app.use('/api/courses', coursesRouter);
app.use('/api/enrollments', enrollmentsRouter);
app.use(notFound);
app.use(errorHandler);

const port = Number(process.env.PORT) || 5000;
if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is missing. Copy server/.env.example to server/.env and configure MongoDB Atlas.');
  process.exit(1);
}
try {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB.');
  app.listen(port, () => console.log(`CampusConnect API listening on port ${port}`));
} catch (err) {
  console.error('Could not connect to MongoDB:', err.message);
  process.exit(1);
}
