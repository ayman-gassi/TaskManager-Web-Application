import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { createUser, findUserByEmail, findUserByEmailAndFullName, findUserById, deleteUserById } from '../services/userService.js';

export const registerUser = async (req, res) => {
    try {
        let { fullName, job, email, password, location } = req.body;
        console.log("calling register with " + fullName + " " + job + " " + email + " " + password);
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.json({ message: 'Email already exists.' , 'state' : false});
        }
        fullName = fullName.toLowerCase();
        // If location is not provided, it will use the default from the model
        const newUser = await createUser({ fullName, job, email, password, location });
        res.json({ message: 'User registered successfully', user: newUser , 'state' : true});
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Error registering user', error: error.message, 'state' : false });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await findUserByEmail(email);
        
        if (!user) {
            return res.json({ message: 'User not found', 'state' : false });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ message: 'Invalid credentials', 'state' : false });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                job: user.job,
                location: user.location,
                profileImage: user.profileImage,
                bannerImage: user.bannerImage
            },
            'state' : true
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error logging in', error: error.message, 'state' : false });
    }
};

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendRecoveryEmail = async (req, res) => {
    try {
        const { email, fullName } = req.body;
        const user = await findUserByEmailAndFullName(email, fullName);

        if (!user) {
            return res.json({ message: 'User not found', 'state': false });
        }

        const recoveryCode = Math.floor(100000 + Math.random() * 900000).toString();
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Recovery Code',
            text: `Your recovery code is: ${recoveryCode}`
        };

        await transporter.sendMail(mailOptions);
        res.json({ message: 'Recovery code sent successfully', 'state': true });
    } catch (error) {
        console.error('Error sending recovery email:', error);
        res.status(500).json({ message: 'Error sending recovery email', error: error.message, 'state': false });
    }
};

export const updateUserImages = async (req, res) => {
    try {
        const userId = req.user.id;
        const userEmail = req.user.email;
        const safeUserDir = userEmail.replace(/[^a-zA-Z0-9]/g, '_');
        const updateData = {};
        
        // Handle image removal requests
        if (req.body.removeProfileImage) {
            updateData.profileImage = null;
        } else if (req.body.removeBannerImage) {
            updateData.bannerImage = null;
        }
        
        // Handle new image uploads
        if (req.files) {
            if (req.files.profileImage) {
                const profilePath = `/uploads/${safeUserDir}/profiles/${req.files.profileImage[0].filename}`;
                updateData.profileImage = profilePath;
            }
            if (req.files.bannerImage) {
                const bannerPath = `/uploads/${safeUserDir}/banners/${req.files.bannerImage[0].filename}`;
                updateData.bannerImage = bannerPath;
            }
        }

        const user = await findUserById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found', state: false });
        }

        // Update user with new image paths or null values
        Object.assign(user, updateData);
        await user.save();

        res.json({
            message: 'Images updated successfully',
            state: true,
            user: {
                profileImage: user.profileImage,
                bannerImage: user.bannerImage
            }
        });
    } catch (error) {
        console.error('Error updating user images:', error);
        res.status(500).json({ message: 'Error updating images', error: error.message, state: false });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { fullName, location, languages, phoneNumber, email, about, skills } = req.body;
        const userId = req.user.id;

        console.log('Updating profile with skills:', skills); // Debug log

        const user = await findUserById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found', state: false });
        }

        // Check if email is being changed and if it's already in use
        if (email && email !== user.email) {
            const existingUser = await findUserByEmail(email);
            if (existingUser) {
                return res.status(400).json({ message: 'Email already in use', state: false });
            }
        }

        // Update fields
        if (fullName) user.fullName = fullName.toLowerCase();
        if (location) user.location = location;
        if (languages) user.languages = languages;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (email) user.email = email;
        if (about !== undefined) user.about = about;
        if (skills !== undefined) {
            console.log('Setting user skills to:', skills); // Debug log
            user.skills = skills;
        }

        await user.save();
        console.log('User saved with skills:', user.skills); // Debug log

        res.json({
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                location: user.location,
                languages: user.languages,
                phoneNumber: user.phoneNumber,
                job: user.job,
                about: user.about,
                profileImage: user.profileImage,
                bannerImage: user.bannerImage,
                skills: user.skills
            },
            state: true
        });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ message: 'Error updating profile', error: error.message, state: false });
    }
};

export const deleteAccount = async (req, res) => {
    try {
        const userId = req.user.id;

        // Find the user first to make sure they exist
        const user = await findUserById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found', state: false });
        }

        // Delete the user
        await deleteUserById(userId);

        res.json({
            message: 'Account deleted successfully',
            state: true
        });
    } catch (error) {
        console.error('Account deletion error:', error);
        res.status(500).json({ message: 'Error deleting account', error: error.message, state: false });
    }
};

export const exportUserData = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await findUserById(userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found', state: false });
        }

        // Prepare user data for export (excluding sensitive information)
        const userData = {
            profile: {
                fullName: user.fullName,
                email: user.email,
                job: user.job,
                location: user.location,
                about: user.about,
                skills: user.skills,
                languages: user.languages,
                phone: user.phone,
                profileImage: user.profileImage,
                bannerImage: user.bannerImage,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        };

        // Send the data as a downloadable JSON file
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename=user_data_${userId}.json`);
        res.json(userData);
    } catch (error) {
        console.error('Export error:', error);
        res.status(500).json({ message: 'Error exporting user data', error: error.message, state: false });
    }
};
