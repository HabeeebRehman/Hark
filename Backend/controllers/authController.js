const User = require('../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '30d'
  });
};

const registerUser = async (req, res) => {
  const { username, email, password, role, skills } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Please add all fields' });
  }

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userSkills = (role === 'developer') ? skills : undefined;

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
      skills: userSkills
    });

    if (user) {
      const response = {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      };

      if (user.role === 'developer') {
        response.skills = user.skills;
      }

      res.status(201).json(response);
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please add email and password' });
  }

  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const response = {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      };

      if (user.role === 'developer') {
        response.skills = user.skills;
      }

      res.json(response);
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const response = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    };

    if (user.role === 'developer') {
      response.skills = user.skills;
    }

    res.json(response);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

module.exports = { registerUser, loginUser, getUserProfile };
