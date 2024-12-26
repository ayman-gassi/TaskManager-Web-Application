import { createTask, getTasksByUser, getTaskById, updateTask, deleteTask } from '../services/taskService.js';

export const addTask = async (req, res) => {
    try {
        const taskData = { ...req.body, user: req.user.id };
        const newTask = await createTask(taskData);
        res.status(201).json({ message: 'Task created successfully', task: newTask , 'state' : true});
    } catch (error) {
        res.status(500).json({ message: 'Error creating task', error , 'state' : false});
    }
};

export const getTasks = async (req, res) => {
    try {
        const tasks = await getTasksByUser(req.user.id);
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tasks', error, 'state' : false });
    }
};

export const getTask = async (req, res) => {
    try {
        const task = await getTaskById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found.' , 'state' : false});
        }
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching task', error, 'state' : false });
    }
};

export const editTask = async (req, res) => {
    try {
        const updatedTask = await updateTask(req.params.id, req.body);
        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found.', 'state' : false });
        }
        res.status(200).json({ message: 'Task updated successfully', task: updatedTask , 'state' : true});
    } catch (error) {
        res.status(500).json({ message: 'Error updating task', error , 'state' : false});
    }
};

export const removeTask = async (req, res) => {
    try {
        const deletedTask = await deleteTask(req.params.id);
        if (!deletedTask) {
            return res.status(404).json({ message: 'Task not found.' , 'state' : false});
        }
        res.status(200).json({ message: 'Task deleted successfully' , 'state' : true});
    } catch (error) {
        res.status(500).json({ message: 'Error deleting task', error , 'state' : false});
    }
};
