import express from 'express';
import { addTask, getTasks, getTask, editTask, removeTask } from '../controllers/taskController.js';
import { checkAuth } from '../middlewares/auth.js';

const router = express.Router();

router.post('/', checkAuth, addTask);
router.get('/', checkAuth, getTasks);
router.get('/:id', checkAuth, getTask);
router.put('/:id', checkAuth, editTask);
router.delete('/:id', checkAuth, removeTask);

export default router;
