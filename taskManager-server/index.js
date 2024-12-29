import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/userRouter.js';
import taskRouter from './routes/taskRouter.js';
import aiRouter from './routes/aiRouter.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Server configuration
app.use(cors());
app.use(express.json());
dotenv.config();

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route for API - Move routes before MongoDB connection
app.use('/api/users', userRouter);
app.use('/api/tasks', taskRouter);
app.use('/api/ai', aiRouter);

const port = process.env.PORT || 9000;
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/task-management';

// Server start
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log('Connected to MongoDB');
    }).catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });
});
