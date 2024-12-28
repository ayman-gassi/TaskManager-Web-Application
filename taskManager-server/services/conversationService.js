import Conversation from '../models/Conversation.js';

export const createConversation = async (data) => {
    const conversation = new Conversation(data);
    return await conversation.save();
};

export const getConversationsByUser = async (userId) => {
    return await Conversation.find({ user: userId });
};

export const getConversationById = async (conversationId,userId) => {
    return await Conversation.find({ _id: conversationId , user: userId });
};

export const addMessageToConversation = async (conversationId, message) => {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) throw new Error('Conversation not found');
    conversation.messages.push(...message);
    return await conversation.save();
};

export const deleteConversation = async (conversationId,userId) => {
    return await Conversation.findAndDelete(conversationId,userId);
};

export const updateConversationTitle = async (conversationId, userId ,newTitle) => {
    const conversation = await Conversation.find({ _id: conversationId , user: userId });
    if (!conversation) throw new Error('Conversation not found');
    conversation.title = newTitle;
    return await conversation.save();
};
