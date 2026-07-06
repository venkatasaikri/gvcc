import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';

// Routes imports
import authRoutes from './routes/auth';
import documentRoutes from './routes/documents';
import askRoutes from './routes/ask';
import dashboardRoutes from './routes/dashboard';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/ask', askRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Database Connection
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
