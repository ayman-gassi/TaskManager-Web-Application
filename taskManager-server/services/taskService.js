import Task from '../models/Task.js';

export const createTask = async (taskData) => {
    const task = new Task(taskData);
    return await task.save();
};

export const getTasksByUser = async (userId) => {
    return await Task.find({ user: userId });
};

export const getTaskById = async (taskId) => {
    return await Task.findById(taskId);
};

export const updateTask = async (taskId, updates) => {
    return await Task.findByIdAndUpdate(taskId, updates, { new: true });
};

export const deleteTask = async (taskId) => {
    return await Task.findByIdAndDelete(taskId);
};
