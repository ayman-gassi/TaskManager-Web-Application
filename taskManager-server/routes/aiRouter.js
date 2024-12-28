import express from 'express';
import * as conversationController from '../controllers/conversationController.js';
import { checkAuth } from '../middlewares/auth.js';
const router = express.Router();

router.post('/ask', checkAuth , conversationController.addMessageToConversation);

router.post('/new', checkAuth , conversationController.createConversation);

router.get('/conv', checkAuth , conversationController.getConversationsByUser);

router.get('/conv/:id', checkAuth ,  conversationController.getConversationById);

router.put('/:id', checkAuth , conversationController.updateConversationTitle);

router.delete('/:id', checkAuth , conversationController.deleteConversation);

export default router;
