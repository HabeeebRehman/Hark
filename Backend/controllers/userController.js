const User = require('../model/User');

const getUsers = async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { username: { $regex: req.query.search, $options: 'i' } },
          { email: { $regex: req.query.search, $options: 'i' } }
        ]
      }
    : {};

  try {
    const users = await User.find(keyword).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateSkills = async (req, res) => {
  const { skills } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.skills = skills;
      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
        skills: updatedUser.skills
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUsers, updateSkills };
