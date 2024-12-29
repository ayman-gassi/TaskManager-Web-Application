import User from '../models/User.js';

export const createUser = async (userData) => {
    return await User.create(userData);
};

export const findUserByEmail = async (email) => {
    return await User.findOne({ email });
};

export const findUserByEmailAndFullName = async (email, fullName) => {
    return await User.findOne({ email, fullName });
};

export const findUserById = async (id) => {
    return await User.findById(id);
};

export const deleteUserById = async (id) => {
    return await User.findByIdAndDelete(id);
};
