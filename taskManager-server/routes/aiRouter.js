import express from 'express';
import * as conversationController from '../controllers/conversationController.js';
import { authenticateToken } from '../middleware/auth.js';
const router = express.Router();

router.post('/ask', authenticateToken , conversationController.addMessageToConversation);

router.post('/new', authenticateToken , conversationController.createConversation);

router.get('/conv', authenticateToken , conversationController.getConversationsByUser);

router.get('/conv/:id', authenticateToken ,  conversationController.getConversationById);

router.put('/:id', authenticateToken , conversationController.updateConversationTitle);

router.delete('/:id', authenticateToken , conversationController.deleteConversation);

export default router;
