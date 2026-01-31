const express = require('express');
const router = express.Router();
const { createProject, getProjects, assignDeveloper, addFile } = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createProject);
router.get('/workspace/:workspaceId', protect, getProjects);
router.post('/:id/assign', protect, assignDeveloper);
router.post('/:id/files', protect, addFile);

module.exports = router;
