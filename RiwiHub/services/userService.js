import User from '../models/User.js'; // Assuming you have a User model defined

export const registerUser = async (userData) => {
  try {
    const newUser = await User.create(userData);
    return newUser;
  } catch (error) {
    throw new Error('Error registering user: ' + error.message);
  }
};

export const loginUser = async (email, password) => {
  try {
    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.validatePassword(password))) {
      throw new Error('Invalid email or password');
    }
    return user;
  } catch (error) {
    throw new Error('Error logging in user: ' + error.message);
  }
};

export const getUserProfile = async (userId) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    throw new Error('Error retrieving user profile: ' + error.message);
  }
};

export const updateUserProfile = async (userId, updatedData) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }
    await user.update(updatedData);
    return user;
  } catch (error) {
    throw new Error('Error updating user profile: ' + error.message);
  }
};