import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/userRouter.js';
import taskRouter from './routes/taskRouter.js';
import aiRouter from './routes/aiRouter.js';
const app = express();

// Server configuration
app.use(cors());
app.use(express.json());
dotenv.config();
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/task-management';

// Server start
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log('Connected to MongoDB');

        // Route for API
        app.use('/api/users',userRouter);
        app.use('/api/tasks',taskRouter);
        app.use('/api/ai',aiRouter);    
    }).catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });
});

