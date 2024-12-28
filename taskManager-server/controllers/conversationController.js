import * as conversationService from '../services/conversationService.js';
import chatbotController  from '../controllers/chatbotController.js';

export const createConversation = async (req, res) => {
    try {
        const { title } = req.body;
        const user = req.user.id;
        const conversation = await conversationService.createConversation({ title, user, messages: [] });
        res.status(201).json({ message: 'Conversation created successfully', state : true});
    } catch (error) {
        res.status(500).json({ message: error.message, state : false });
    }
};

export const getConversationsByUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const conversations = await conversationService.getConversationsByUser(userId);
        res.status(200).json({ conversations , state : true});
    } catch (error) {
        res.status(500).json({ message: error.message , state : false});
    }
};

export const getConversationById = async (req, res) => {
    try {
        const userId = req.user.id;
        const conversationId = req.params.id;
        const conversation = await conversationService.getConversationById(conversationId,userId);
        if (!conversation) return res.status(404).json({ message: 'Conversation not found' });
        res.status(200).json({ conversation , state : true});
    } catch (error) {
        res.status(500).json({ message: error.message , state : false});
    }
};

export const addMessageToConversation = async (req, res) => {
   try {
           const { message , convId } = req.body;
           const response = await chatbotController.processMessage(req.user.id, message);
           const saveToConv = await conversationService.addMessageToConversation(convId, [{ sender: 'user',message : message }, { sender: 'bot', message: response }]);
           res.json({ response : response , state : true});
       } catch (error) {
           res.status(500).json({ error: error.message , state : false});
       }   
};

export const updateConversationTitle = async (req, res) => {
    try {
        const userId = req.user.id;
        const conversationId = req.params.id;
        const { title } = req.body;
        const updatedConversation = await conversationService.updateConversationTitle(conversationId, userId ,  title);
        res.status(200).json({ message: 'Conversation updated successfully', state : true});
    } catch (error) {
        res.status(500).json({ message: error.message , state : false});
    }
};

export const deleteConversation = async (req, res) => {
    try {
        const conversationId = req.params.id;
        const userId = req.user.id;
        const deletedConv = await conversationService.deleteConversation(conversationId, userId);
        res.status(200).json({ message: 'Conversation deleted successfully' , state : true});
    } catch (error) {
        res.status(500).json({ message: error.message , state : false});
    }
};
