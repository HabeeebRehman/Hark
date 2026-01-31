const Project = require('../model/Project');
const Workspace = require('../model/Workspace');

const createProject = async (req, res) => {
  const { name, workspaceId, startDate, endDate } = req.body;

  try {
    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    // Verify user is member of workspace
    const isMember = workspace.members.some(
      (m) => m.user.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const project = await Project.create({
      name,
      workspace: workspaceId,
      manager: req.user._id,
      startDate,
      endDate
    });

    // Add project to workspace
    workspace.projects.push(project._id);
    await workspace.save();

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ workspace: req.params.workspaceId })
      .populate('manager', 'username')
      .populate('developers', 'username email skills')
      .populate('files.assignedTo', 'username')
      .populate('files.uploadedBy', 'username');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const assignDeveloper = async (req, res) => {
  const { userId } = req.body;
  const projectId = req.params.id;

  try {
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check permissions (Manager or Workspace Admin)
    if (project.manager.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (!project.developers.includes(userId)) {
      project.developers.push(userId);
      await project.save();
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addFile = async (req, res) => {
  const { filename, url, assignedTo, summary, notes } = req.body;
  const projectId = req.params.id;

  try {
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const newFile = {
      filename,
      url,
      assignedTo,
      summary,
      notes,
      uploadedBy: req.user._id
    };

    project.files.push(newFile);
    await project.save();

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createProject, getProjects, assignDeveloper, addFile };
