const express = require('express');
const router = express.Router();
const { getUsers, updateSkills } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getUsers);
router.put('/skills', protect, updateSkills);

module.exports = router;
