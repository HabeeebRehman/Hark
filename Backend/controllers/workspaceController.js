const Workspace = require('../model/Workspace');
const User = require('../model/User');
const createWorkspace = async (req, res) => {
  const { name } = req.body;

  try {
    const workspace = await Workspace.create({
      name,
      owner: req.user._id,
      members: [{ user: req.user._id, role: 'admin' }]
    });

    res.status(201).json(workspace);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getWorkspaces = async (req, res) => {
  try {
    const workspaces = await Workspace.find({
      'members.user': req.user._id
    }).populate('members.user', 'username email role');

    res.json(workspaces);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addMember = async (req, res) => {
  const { userId, role } = req.body;
  const workspaceId = req.params.id;

  try {
    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    // Check if requester is admin of workspace
    const isMember = workspace.members.find(
      (member) => member.user && member.user.toString() === req.user._id.toString() && member.role === 'admin'
    );

    if (!isMember && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to add members' });
    }

    // Check if user already in workspace
    const alreadyMember = workspace.members.find(
      (member) => member.user && member.user.toString() === userId
    );

    if (alreadyMember) {
      return res.status(400).json({ message: 'User already in workspace' });
    }

    workspace.members.push({ user: userId, role: role || 'member' });
    await workspace.save();

    res.json(workspace);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createWorkspace, getWorkspaces, addMember };
