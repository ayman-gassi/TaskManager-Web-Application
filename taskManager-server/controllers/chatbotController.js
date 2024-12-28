import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Task from '../models/Task.js';
dotenv.config();

// Initialize Gemini
const genAI = new GoogleGenerativeAI("AIzaSyCl5yoaxsD6NwC0KZguaPVAZpPRdFN7jKE");
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

class chatbotController {
    async analyzeIntent(message) {
        try {
            const prompt = `Analyze the following message and classify it into one of these categories: 'create task', 'update task', 'delete task', 'list tasks', 'view task' , 'greeting'. 
                          Only respond with the category name.
                          Message: "${message}"`;

            const result = await model.generateContent(prompt);
            const response = result.response;
            const intent = response.text().trim().toLowerCase();

            // Validate that the response is one of the expected intents
            const validIntents = ['create task', 'update task', 'delete task', 'list tasks', 'view task', 'greeting'];
            return validIntents.includes(intent) ? intent : null;
        } catch (error) {
            console.error('Intent analysis error:', error.message);
            throw new Error('Failed to analyze intent');
        }
    }

    async extractTaskDetails(message) {
        try {
            const prompt = `Extract task details from this message: "${message}"
                          Respond in this exact format (including the labels):
                          Title: [extracted title]
                          Priority: [low/medium/high if mentioned]
                          Due Date: [extracted date if mentioned in MM/DD/YYYY format]
                          
                          Only include the fields if they are mentioned in the message.
                          Don't add any other text or explanations.`;

            const result = await model.generateContent(prompt);
            const response = result.response;
            return this.parseTaskDetails(response.text());
        } catch (error) {
            console.error('Task extraction error:', error);
            throw new Error('Failed to extract task details');
        }
    }

    parseTaskDetails(text) {
        const details = {};
        
        // Extract title
        const titleMatch = text.match(/Title: (.*?)(\n|$)/);
        if (titleMatch) details.title = titleMatch[1].trim();

        // Extract priority
        const priorityMatch = text.match(/Priority: (low|medium|high)/i);
        if (priorityMatch) details.priority = priorityMatch[1].toLowerCase();

        // Extract due date
        const dateMatch = text.match(/Due Date: (\d{2}\/\d{2}\/\d{4})/);
        if (dateMatch) details.dueDate = new Date(dateMatch[1]);

        return details;
    }

    // The rest of the methods remain the same as they don't use external AI services
    async processMessage(userId, message) {
        try {
            const intent = await this.analyzeIntent(message);
            if (!intent) {
                return "I'm not sure what you want to do. Could you please rephrase? If you have a general question, please note that I can only assist with task management.";
            }

            const taskDetails = await this.extractTaskDetails(message);

            switch (intent) {
                case 'create task':
                    return await this.createTask(userId, taskDetails);
                case 'update task':
                    return await this.updateTask(userId, taskDetails);
                case 'delete task':
                    return await this.deleteTask(userId, taskDetails);
                case 'list tasks':
                    return await this.listTasks(userId);
                case 'view task':
                    return await this.viewTask(userId, taskDetails);
                case 'greeting':
                    return "Hello! How can I assist you with your tasks today?";
                default:
                    return "I'm not sure what you want to do. Could you please rephrase?";
            }
        } catch (error) {
            console.error('Message processing error:', error);
            return "Sorry, I couldn't process your request.";
        }
    }

    async createTask(userId, taskDetails) {
        try {
            if (!taskDetails.title) {
                return "I couldn't understand the task details. Please specify a title.";
            }

            const task = new Task({
                ...taskDetails,
                user: userId,
                status: 'pending'
            });

            await task.save();
            return `Task created: "${taskDetails.title}"`;
        } catch (error) {
            return "Failed to create task.";
        }
    }

    async updateTask(userId, taskDetails) {
        try {
            if (!taskDetails.title) {
                return "Which task do you want to update?";
            }   

            const task = await Task.findOneAndUpdate(
                { title: taskDetails.title, user: userId },
                taskDetails,
                { new: true }
            );

            return task ? 
                `Updated task: "${task.title}"` : 
                "Couldn't find that task.";
        } catch (error) {
            return "Failed to update task.";
        }
    }

    async deleteTask(userId, taskDetails) {
        try {
            if (!taskDetails.title) {
                return "Which task do you want to delete?";
            }

            const task = await Task.findOneAndDelete({
                title: taskDetails.title,
                user: userId
            });

            return task ? 
                `Deleted task: "${taskDetails.title}"` : 
                "Couldn't find that task.";
        } catch (error) {
            return "Failed to delete task.";
        }
    }

    async listTasks(userId) {
        try {
            const tasks = await Task.find({ user: userId });
            if (tasks.length === 0) return "You don't have any tasks.";

            return tasks.map(task => 
                `- ${task.title} (${task.priority || 'no priority'})` +
                `${task.dueDate ? ` due ${task.dueDate.toLocaleDateString()}` : ''}`
            ).join('\n');
        } catch (error) {
            return "Failed to list tasks.";
        }
    }

    async viewTask(userId, taskDetails) {
        try {
            if (!taskDetails.title) {
                return "Which task do you want to view?";
            }

            const task = await Task.findOne({
                title: taskDetails.title,
                user: userId
            });

            if (!task) return "Couldn't find that task.";

            return `Task: ${task.title}\n` +
                   `Priority: ${task.priority || 'not set'}\n` +
                   `Status: ${task.status}\n` +
                   `Due: ${task.dueDate ? task.dueDate.toLocaleDateString() : 'no due date'}`;
        } catch (error) {
            return "Failed to view task.";
        }
    }
}

export default new chatbotController();