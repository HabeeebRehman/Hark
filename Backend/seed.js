const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./model/User');
const Workspace = require('./model/Workspace');
const Project = require('./model/ProjectModel');
const Task = require('./model/Task');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await User.deleteMany();
    await Workspace.deleteMany();
    await Project.deleteMany();
    await Task.deleteMany();

    console.log('Data Destroyed...');

    // 1. Create Users (Admin/Manager & Developer)
    const salt = await bcrypt.genSalt(10);
    const hashPassword = async (password) => await bcrypt.hash(password, salt);

    const managerPassword = await hashPassword('manager123');
    const developerPassword = await hashPassword('dev123');

    const developerUser = await User.create({
      username: 'Bob Developer',
      email: 'bob@example.com',
      password: developerPassword,
      role: 'developer',
      skills: [
        { name: 'JavaScript', level: 'expert' },
        { name: 'React', level: 'intermediate' },
        { name: 'Node.js', level: 'intermediate' }
      ]
    });

    const managerUser = await User.create({
      username: 'Alice Manager',
      email: 'alice@example.com',
      password: managerPassword,
      role: 'manager',
      managedDevelopers: [developerUser._id]
    });

    console.log('Users Created...');

    // 2. Create Workspace
    const workspace = await Workspace.create({
      name: 'Tech Innovations',
      owner: managerUser._id,
      members: [
        { user: managerUser._id, role: 'admin' },
        { user: developerUser._id, role: 'member' }
      ]
    });

    console.log('Workspace Created...');

    // 3. Create Project
    const project = await Project.create({
      name: 'Website Redesign',
      workspace: workspace._id,
      manager: managerUser._id,
      developers: [developerUser._id],
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 30)), // 30 days from now
      status: 'active',
      files: [
        {
          filename: 'DesignSpecs.pdf',
          url: 'http://example.com/files/design.pdf',
          assignedTo: developerUser._id,
          summary: 'Initial design specifications for homepage',
          notes: 'Focus on mobile responsiveness first',
          uploadedBy: managerUser._id
        }
      ]
    });

    workspace.projects.push(project._id);
    await workspace.save();

    console.log('Project Created...');

    // 4. Create Task
    const task = await Task.create({
      title: 'Design Homepage',
      description: 'Create a responsive homepage design using Figma',
      project: project._id,
      assignedTo: developerUser._id,
      priority: 'high',
      status: 'in-progress',
      dueDate: new Date(new Date().setDate(new Date().getDate() + 7))
    });

    project.tasks.push(task._id);
    await project.save();

    console.log('Task Created...');

    console.log('Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

importData();
