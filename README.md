# ⚡ Hark

**All-in-One Project Management & Developer Collaboration Platform**

Hark is a comprehensive productivity management system that bridges the gap between project managers and developers through seamless collaboration. It consists of a web application for managers and a VS Code extension for developers.

---

## 📋 Overview

Hark solves the disconnect between project management tools and developer workflows by providing:

- **Web Dashboard** for managers to create projects, assign tasks, and track team performance
- **VS Code Extension** for developers to view tasks, access files, and manage their work

### Key Benefits

- Centralized task and file management
- Real-time collaboration between managers and developers
- Integrated version control insights
- Seamless workflow from task assignment to completion

---

## ✨ Features

### Web Application (For Managers & Team Leads)

**Project Management**
- Create and manage multiple workspaces and projects
- Visual progress tracking with analytics
- Customizable project themes and colors
- Deadline management

**Task Management**
- Create detailed tasks with descriptions and priorities
- Assign tasks to specific developers
- Attach files and resources
- Track status: To-Do → In Progress → Completed
- Priority levels: High, Medium, Low

**Team Management**
- Add and remove developers from projects
- View detailed developer profiles
- Skill levels visualization (1-5 scale)
- Track performance metrics and task completion
- Monitor availability status

**User Interface**
- Modern glassmorphism design
- Smooth animations and transitions
- Fully responsive for all devices
- Intuitive navigation

### VS Code Extension (For Developers)

**Task Management**
- View assigned tasks directly in VS Code
- Real-time task notifications
- Update task status seamlessly
- Add notes and comments

**File Management**
- Access project files assigned by Managers

**Developer Experience**
- Lightweight and fast
- Clean, minimal interface
- Keyboard shortcuts
- Non-intrusive notifications

---

## 🛠️ Tech Stack

### Web Application

**Frontend**
- React.js - UI framework
- CSS3 - Styling with glassmorphism effects
- Responsive Design

**Backend**
- Node.js - Runtime environment
- Express.js - Web framework
- MongoDB - Database
- Mongoose - ODM for MongoDB
- JWT - Authentication
- Bcrypt - Password encryption

### VS Code Extension

- TypeScript - Type-safe development
- VS Code API - Extension framework
- Node.js - Extension backend

### Additional Tools

- Git - Version control

---

## 📦 Installation

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (v5.0 or higher)
- npm or yarn
- VS Code (for extension)
- Git

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/hark.git
cd hark

# Navigate to backend
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your settings
# MONGODB_URI=your_mongodb_connection_string
# JWT_SECRET=your_secret_key
# PORT=5000

# Start the server
npm run dev
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env
# REACT_APP_API_URL=http://localhost:5000

# Start development server
npm start
```

### VS Code Extension Setup

```bash
# Navigate to extension directory
cd vscode-extension

# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Open in VS Code and press F5 to run extension in development mode
```

---

## 🚀 Usage

### For Managers

1. **Create a Project**
   - Log in to the web application
   - Click "New Project"
   - Fill in project details
   - Assign team members

2. **Assign Tasks**
   - Select a project
   - Click "Add Task"
   - Enter task details and assign to developer
   - Attach relevant files

3. **Track Progress**
   - View project dashboard
   - Monitor task statuses in real-time
   - Check team performance metrics

### For Developers

1. **Install Extension**
   - Open VS Code
   - Search for "Hark" in Extensions
   - Install and authenticate

2. **View Tasks**
   - Open Hark panel
   - View assigned tasks
   - Filter by status or project

3. **Work on Tasks**
   - Update task status as you progress
   - Add comments and notes

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- Modern glassmorphism design inspiration
- VS Code extension development community

---

**Made with ❤️ for developers**
