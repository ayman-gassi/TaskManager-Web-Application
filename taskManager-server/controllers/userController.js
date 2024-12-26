import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail } from '../services/userService.js';

export const registerUser = async (req, res) => {
    try {
        const { fullName, job, email, password } = req.body;

        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists.'  , 'state' : false});
        }

        const newUser = await createUser({ fullName, job, email, password });
        res.status(201).json({ message: 'User registered successfully', user: newUser , 'state' : true});
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error : error.message , 'state' : false});
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password.' , state : false});
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password.', state : false});
        }

        const token = jwt.sign({ id: user._id, fullName : user.fullName ,  email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ 
            message: 'Login successful', 
            state : true,
            token
        });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error  , 'state' : false});
    }
};

