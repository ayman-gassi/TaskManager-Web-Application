import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { createUser, findUserByEmail , findUserByEmailAndFullName} from '../services/userService.js';

export const registerUser = async (req, res) => {
    try {
        const { fullName, job, email, password } = req.body;
        console.log("calling register with " + fullName + " " + job + " " + email + " " + password);
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.json({ message: 'Email already exists.'  , 'state' : false});
        }
        fullName = fullName.toLowerCase();
        const newUser = await createUser({ fullName, job, email, password });
        res.json({ message: 'User registered successfully', user: newUser , 'state' : true});
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error : error.message , 'state' : false});
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("calling login with " + email + " " + password);
        const user = await findUserByEmail(email);
        if (!user) {
            return res.json({ message: 'Invalid email or password.' , state : false});
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.json({ message: 'Invalid email or password.', state : false});
        }

        const token = jwt.sign({ id: user._id, fullName : user.fullName ,  email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ 
            message: 'Login successful', 
            state : true,
            token
        });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error  , 'state' : false});
    }
};

export const authentificatedUser = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    console.log("calling authentificatedUser");
        if (!token) return res.sendStatus(403); 
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); 
        res.json({ message: 'User data', user });
    });
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
    },
});

export const sendRecoveryEmail = async (req , res) => {
    try {
        const { email, userName } = req.body;
        console.log("calling sendRecoveryEmail with " + email + " " + userName.toLowerCase());
        const user = await findUserByEmailAndFullName(email,userName.toLowerCase());
        if (!user) {
            return res.json({ message: 'Recovery Email sent successfully', state: true });
        }
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Recovery',
            text: `Hello ${userName},\n\nPlease click the link below to recover your password:\n\n${process.env.CLIENTSIDE_URL+'/'+user._id}\n\nThank you!`,
        };
        await transporter.sendMail(mailOptions);
        res.json({ message: 'Recovery Email sent successfully', state: true });
    } catch (error) {
        res.status(500).json({ message: 'Error sending recovery email', error: error.message, state: false });
    }

};

