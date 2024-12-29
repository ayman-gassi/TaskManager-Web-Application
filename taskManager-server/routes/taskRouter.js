import express from 'express';
import { addTask, getTasks, getTask, editTask, removeTask } from '../controllers/taskController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticateToken, addTask);
router.get('/', authenticateToken, getTasks);
router.get('/:id', authenticateToken, getTask);
router.put('/:id', authenticateToken, editTask);
router.delete('/:id', authenticateToken, removeTask);

export default router;
