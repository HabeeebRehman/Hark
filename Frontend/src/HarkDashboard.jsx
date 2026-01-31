import React, { useState } from 'react';
import { Plus, Users, FolderKanban, FileCode, Search, Bell, Settings, ChevronDown, Upload, X, Edit2, Trash2, Eye, Calendar, Clock, CheckCircle2, Circle, Loader } from 'lucide-react';

const HarkDashboard = () => {
    const [activeProject, setActiveProject] = useState(null);
    const [showCreateProject, setShowCreateProject] = useState(false);
    const [showAddTask, setShowAddTask] = useState(false);
    const [showAddMember, setShowAddMember] = useState(false);
    const [selectedDeveloper, setSelectedDeveloper] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');

    // Mock data
    const [projects, setProjects] = useState([
        {
            id: 1,
            name: 'E-Commerce Platform',
            description: 'Building next-gen shopping experience',
            color: '#fffefeff',
            progress: 68,
            members: 8,
            tasks: 24,
            completedTasks: 16,
            deadline: '2024-03-15'
        },
        {
            id: 2,
            name: 'Mobile Banking App',
            description: 'Secure financial management',
            color: '#4ECDC4',
            progress: 45,
            members: 6,
            tasks: 18,
            completedTasks: 8,
            deadline: '2024-04-20'
        },
        {
            id: 3,
            name: 'AI Analytics Dashboard',
            description: 'Real-time data visualization',
            color: '#FFE66D',
            progress: 82,
            members: 5,
            tasks: 15,
            completedTasks: 12,
            deadline: '2024-02-28'
        }
    ]);

    const [developers, setDevelopers] = useState([
        {
            id: 1,
            name: 'Sarah Chen',
            role: 'Senior Full-Stack Developer',
            avatar: '👩‍💻',
            skills: [
                { name: 'React', level: 5 },
                { name: 'Node.js', level: 5 },
                { name: 'TypeScript', level: 4 },
                { name: 'Python', level: 4 },
                { name: 'AWS', level: 3 }
            ],
            tasksCompleted: 47,
            activeProjects: 2,
            availability: 'Available'
        },
        {
            id: 2,
            name: 'Marcus Rodriguez',
            role: 'Frontend Developer',
            avatar: '👨‍💻',
            skills: [
                { name: 'React', level: 5 },
                { name: 'Vue.js', level: 4 },
                { name: 'CSS/SCSS', level: 5 },
                { name: 'JavaScript', level: 5 },
                { name: 'Figma', level: 4 }
            ],
            tasksCompleted: 52,
            activeProjects: 3,
            availability: 'Busy'
        },
        {
            id: 3,
            name: 'Aisha Patel',
            role: 'Backend Developer',
            avatar: '👩‍💼',
            skills: [
                { name: 'Java', level: 5 },
                { name: 'Spring Boot', level: 5 },
                { name: 'PostgreSQL', level: 4 },
                { name: 'Docker', level: 4 },
                { name: 'Kubernetes', level: 3 }
            ],
            tasksCompleted: 38,
            activeProjects: 1,
            availability: 'Available'
        },
        {
            id: 4,
            name: 'James Wilson',
            role: 'DevOps Engineer',
            avatar: '🧑‍💻',
            skills: [
                { name: 'AWS', level: 5 },
                { name: 'Docker', level: 5 },
                { name: 'Terraform', level: 4 },
                { name: 'Jenkins', level: 4 },
                { name: 'Python', level: 3 }
            ],
            tasksCompleted: 31,
            activeProjects: 2,
            availability: 'Available'
        }
    ]);

    const [tasks, setTasks] = useState([
        {
            id: 1,
            title: 'Implement Authentication System',
            description: 'Set up JWT-based authentication with refresh tokens',
            status: 'In Progress',
            assignee: 'Sarah Chen',
            files: ['auth.service.ts', 'user.model.ts'],
            priority: 'High',
            dueDate: '2024-02-10'
        },
        {
            id: 2,
            title: 'Design Product Catalog UI',
            description: 'Create responsive product grid with filters',
            status: 'To-Do',
            assignee: 'Marcus Rodriguez',
            files: ['ProductGrid.jsx', 'Filter.jsx'],
            priority: 'Medium',
            dueDate: '2024-02-15'
        },
        {
            id: 3,
            title: 'Optimize Database Queries',
            description: 'Add indexes and optimize slow queries',
            status: 'Completed',
            assignee: 'Aisha Patel',
            files: ['migrations/001_add_indexes.sql'],
            priority: 'High',
            dueDate: '2024-02-05'
        }
    ]);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Completed': return <CheckCircle2 className="w-4 h-4" />;
            case 'In Progress': return <Loader className="w-4 h-4" />;
            default: return <Circle className="w-4 h-4" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return '#4ECDC4';
            case 'In Progress': return '#FFE66D';
            default: return '#95A5A6';
        }
    };

    const SkillBar = ({ skill, level }) => {
        const percentage = (level / 5) * 100;
        return (
            <div className="skill-item">
                <div className="skill-header">
                    <span className="skill-name">{skill}</span>
                    <span className="skill-level">Level {level}</span>
                </div>
                <div className="skill-bar-container">
                    <div className="skill-bar-fill" style={{ width: `${percentage}%` }}></div>
                </div>
            </div>
        );
    };

    return (
        <div className="app-container">
            {/* Animated Background */}
            <div className="background-animation">
                <div className="orb orb-1"></div>
                <div className="orb orb-2"></div>
                <div className="orb orb-3"></div>
            </div>

            {/* Sidebar */}
            <aside className="sidebar">
                <div className="logo">
                    <div className="logo-icon">⚡</div>
                    <h1 className="logo-text">Hark</h1>
                </div>

                <nav className="nav-menu">
                    <button className="nav-item active">
                        <FolderKanban className="nav-icon" />
                        <span>Projects</span>
                    </button>
                    <button className="nav-item">
                        <Users className="nav-icon" />
                        <span>Team</span>
                    </button>
                    <button className="nav-item">
                        <FileCode className="nav-icon" />
                        <span>Files</span>
                    </button>
                    <button className="nav-item">
                        <Calendar className="nav-icon" />
                        <span>Calendar</span>
                    </button>
                </nav>

                <div className="sidebar-footer">
                    <button className="nav-item">
                        <Settings className="nav-icon" />
                        <span>Settings</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                {/* Header */}
                <header className="header">
                    <div className="header-left">
                        <h2 className="page-title">Project Dashboard</h2>
                        <p className="page-subtitle">Manage your team and track progress</p>
                    </div>
                    <div className="header-right">
                        <button className="icon-button">
                            <Search className="w-5 h-5" />
                        </button>
                        <button className="icon-button notification-btn">
                            <Bell className="w-5 h-5" />
                            <span className="notification-badge">3</span>
                        </button>
                        <div className="user-avatar">
                            <span>👤</span>
                        </div>
                    </div>
                </header>

                {/* Stats Cards */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                            <FolderKanban className="w-6 h-6" />
                        </div>
                        <div className="stat-content">
                            <p className="stat-label">Active Projects</p>
                            <h3 className="stat-value">{projects.length}</h3>
                            <span className="stat-change positive">+2 this month</span>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                            <Users className="w-6 h-6" />
                        </div>
                        <div className="stat-content">
                            <p className="stat-label">Team Members</p>
                            <h3 className="stat-value">{developers.length}</h3>
                            <span className="stat-change positive">+1 this week</span>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div className="stat-content">
                            <p className="stat-label">Tasks Completed</p>
                            <h3 className="stat-value">{tasks.filter(t => t.status === 'Completed').length}/{tasks.length}</h3>
                            <span className="stat-change positive">68% completion</span>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
                            <Clock className="w-6 h-6" />
                        </div>
                        <div className="stat-content">
                            <p className="stat-label">In Progress</p>
                            <h3 className="stat-value">{tasks.filter(t => t.status === 'In Progress').length}</h3>
                            <span className="stat-change">Active tasks</span>
                        </div>
                    </div>
                </div>

                {/* Action Bar */}
                <div className="action-bar">
                    <button className="primary-button" onClick={() => setShowCreateProject(true)}>
                        <Plus className="w-5 h-5" />
                        New Project
                    </button>
                    <button className="secondary-button" onClick={() => setShowAddTask(true)}>
                        <Plus className="w-5 h-5" />
                        Add Task
                    </button>
                    <button className="secondary-button" onClick={() => setShowAddMember(true)}>
                        <Users className="w-5 h-5" />
                        Add Member
                    </button>
                </div>

                {/* Projects Grid */}
                <section className="section">
                    <h3 className="section-title">Active Projects</h3>
                    <div className="projects-grid">
                        {projects.map(project => (
                            <div key={project.id} className="project-card" onClick={() => setActiveProject(project)}>
                                <div className="project-header">
                                    <div className="project-color" style={{ backgroundColor: project.color }}></div>
                                    <button className="card-menu-btn">
                                        <ChevronDown className="w-5 h-5" />
                                    </button>
                                </div>
                                <h4 className="project-name">{project.name}</h4>
                                <p className="project-description">{project.description}</p>

                                <div className="project-progress">
                                    <div className="progress-header">
                                        <span className="progress-label">Progress</span>
                                        <span className="progress-value">{project.progress}%</span>
                                    </div>
                                    <div className="progress-bar">
                                        <div className="progress-fill" style={{ width: `${project.progress}%`, backgroundColor: project.color }}></div>
                                    </div>
                                </div>

                                <div className="project-meta">
                                    <div className="meta-item">
                                        <Users className="w-4 h-4" />
                                        <span>{project.members} members</span>
                                    </div>
                                    <div className="meta-item">
                                        <CheckCircle2 className="w-4 h-4" />
                                        <span>{project.completedTasks}/{project.tasks} tasks</span>
                                    </div>
                                </div>

                                <div className="project-footer">
                                    <span className="deadline">Due: {new Date(project.deadline).toLocaleDateString()}</span>
                                    <button className="view-button">View →</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Tasks Section */}
                <section className="section">
                    <div className="section-header">
                        <h3 className="section-title">Recent Tasks</h3>
                        <div className="task-filters">
                            <button className="filter-btn active">All</button>
                            <button className="filter-btn">To-Do</button>
                            <button className="filter-btn">In Progress</button>
                            <button className="filter-btn">Completed</button>
                        </div>
                    </div>

                    <div className="tasks-list">
                        {tasks.map(task => (
                            <div key={task.id} className="task-item">
                                <div className="task-status" style={{ backgroundColor: getStatusColor(task.status) }}>
                                    {getStatusIcon(task.status)}
                                </div>
                                <div className="task-content">
                                    <h4 className="task-title">{task.title}</h4>
                                    <p className="task-description">{task.description}</p>
                                    <div className="task-meta">
                                        <span className="task-assignee">👤 {task.assignee}</span>
                                        <span className="task-files">📄 {task.files.length} files</span>
                                        <span className={`task-priority priority-${task.priority.toLowerCase()}`}>{task.priority}</span>
                                        <span className="task-date">📅 {new Date(task.dueDate).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div className="task-actions">
                                    <button className="task-action-btn"><Edit2 className="w-4 h-4" /></button>
                                    <button className="task-action-btn"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Team Members Section */}
                <section className="section">
                    <h3 className="section-title">Team Members</h3>
                    <div className="team-grid">
                        {developers.map(dev => (
                            <div key={dev.id} className="developer-card" onClick={() => setSelectedDeveloper(dev)}>
                                <div className="dev-avatar-large">{dev.avatar}</div>
                                <h4 className="dev-name">{dev.name}</h4>
                                <p className="dev-role">{dev.role}</p>

                                <div className="dev-stats">
                                    <div className="dev-stat">
                                        <span className="dev-stat-value">{dev.tasksCompleted}</span>
                                        <span className="dev-stat-label">Tasks Done</span>
                                    </div>
                                    <div className="dev-stat">
                                        <span className="dev-stat-value">{dev.activeProjects}</span>
                                        <span className="dev-stat-label">Projects</span>
                                    </div>
                                </div>

                                <div className={`availability-badge ${dev.availability.toLowerCase()}`}>
                                    {dev.availability}
                                </div>

                                <button className="view-profile-btn">View Profile</button>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* Modals */}
            {showCreateProject && (
                <div className="modal-overlay" onClick={() => setShowCreateProject(false)}>
                    <div className="modal glass-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">Create New Project</h3>
                            <button className="close-btn" onClick={() => setShowCreateProject(false)}>
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label className="form-label">Project Name</label>
                                <input type="text" className="form-input" placeholder="Enter project name" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea className="form-textarea" placeholder="Describe your project" rows="3"></textarea>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Project Color</label>
                                    <input type="color" className="form-color" defaultValue="#FF6B9D" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Deadline</label>
                                    <input type="date" className="form-input" />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="secondary-button" onClick={() => setShowCreateProject(false)}>Cancel</button>
                            <button className="primary-button">Create Project</button>
                        </div>
                    </div>
                </div>
            )}

            {showAddTask && (
                <div className="modal-overlay" onClick={() => setShowAddTask(false)}>
                    <div className="modal glass-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">Add New Task</h3>
                            <button className="close-btn" onClick={() => setShowAddTask(false)}>
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label className="form-label">Task Title</label>
                                <input type="text" className="form-input" placeholder="Enter task title" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea className="form-textarea" placeholder="Describe the task" rows="3"></textarea>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Assign To</label>
                                    <select className="form-select">
                                        <option>Select developer</option>
                                        {developers.map(dev => (
                                            <option key={dev.id} value={dev.id}>{dev.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Priority</label>
                                    <select className="form-select">
                                        <option>High</option>
                                        <option>Medium</option>
                                        <option>Low</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Attached Files</label>
                                <button className="upload-btn">
                                    <Upload className="w-4 h-4" />
                                    Upload Files
                                </button>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="secondary-button" onClick={() => setShowAddTask(false)}>Cancel</button>
                            <button className="primary-button">Add Task</button>
                        </div>
                    </div>
                </div>
            )}

            {selectedDeveloper && (
                <div className="modal-overlay" onClick={() => setSelectedDeveloper(null)}>
                    <div className="modal glass-modal developer-profile-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="profile-header">
                                <div className="profile-avatar">{selectedDeveloper.avatar}</div>
                                <div>
                                    <h3 className="modal-title">{selectedDeveloper.name}</h3>
                                    <p className="profile-role">{selectedDeveloper.role}</p>
                                </div>
                            </div>
                            <button className="close-btn" onClick={() => setSelectedDeveloper(null)}>
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="profile-stats-row">
                                <div className="profile-stat">
                                    <span className="profile-stat-value">{selectedDeveloper.tasksCompleted}</span>
                                    <span className="profile-stat-label">Tasks Completed</span>
                                </div>
                                <div className="profile-stat">
                                    <span className="profile-stat-value">{selectedDeveloper.activeProjects}</span>
                                    <span className="profile-stat-label">Active Projects</span>
                                </div>
                                <div className="profile-stat">
                                    <span className={`availability-badge ${selectedDeveloper.availability.toLowerCase()}`}>
                                        {selectedDeveloper.availability}
                                    </span>
                                </div>
                            </div>

                            <div className="skills-section">
                                <h4 className="skills-title">Technical Skills</h4>
                                <div className="skills-list">
                                    {selectedDeveloper.skills.map((skill, index) => (
                                        <SkillBar key={index} skill={skill.name} level={skill.level} />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="secondary-button">Assign Task</button>
                            <button className="primary-button">Send Message</button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .app-container {
          display: flex;
          min-height: 100vh;
          background: #000000;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
          color: #ffffff;
          position: relative;
          overflow-x: hidden;
        }

        /* Animated Background */
        .background-animation {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          overflow: hidden;
          z-index: 0;
        }

        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.4;
          animation: float 20s infinite ease-in-out;
        }

        .orb-1 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, #667eea 0%, #764ba2 100%);
          top: -10%;
          left: -10%;
          animation-delay: 0s;
        }

        .orb-2 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, #f093fb 0%, #f5576c 100%);
          bottom: -10%;
          right: 10%;
          animation-delay: -7s;
        }

        .orb-3 {
          width: 450px;
          height: 450px;
          background: radial-gradient(circle, #4facfe 0%, #00f2fe 100%);
          top: 40%;
          right: -10%;
          animation-delay: -14s;
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(50px, 100px) scale(1.1); }
          50% { transform: translate(-30px, 50px) scale(0.9); }
          75% { transform: translate(30px, -50px) scale(1.05); }
        }

        /* Sidebar */
        .sidebar {
          width: 280px;
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          border-right: 1px solid rgba(255, 255, 255, 0.1);
          padding: 2rem 1.5rem;
          display: flex;
          flex-direction: column;
          position: relative;
          z-index: 10;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 3rem;
        }

        .logo-icon {
          width: 45px;
          height: 45px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
        }

        .logo-text {
          font-size: 28px;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea 0%, #f5576c 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: -0.5px;
        }

        .nav-menu {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.25rem;
          background: transparent;
          border: none;
          border-radius: 12px;
          color: rgba(255, 255, 255, 0.6);
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 15px;
          font-weight: 500;
        }

        .nav-item:hover {
          background: rgba(255, 255, 255, 0.05);
          color: rgba(255, 255, 255, 0.9);
        }

        .nav-item.active {
          background: rgba(102, 126, 234, 0.15);
          color: #ffffff;
          box-shadow: 0 4px 20px rgba(102, 126, 234, 0.2);
        }

        .nav-icon {
          width: 20px;
          height: 20px;
        }

        .sidebar-footer {
          margin-top: auto;
        }

        /* Main Content */
        .main-content {
          flex: 1;
          padding: 2rem 3rem;
          overflow-y: auto;
          position: relative;
          z-index: 1;
          background: #000000;
        }

        /* Header */
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2.5rem;
        }

        .page-title {
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: #ffffff;
        }

        .page-subtitle {
          color: #9ca3af;
          font-size: 14px;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .icon-button {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          color: rgba(255, 255, 255, 0.7);
        }

        .icon-button:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.2);
          color: #ffffff;
        }

        .notification-btn {
          position: relative;
        }

        .notification-badge {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 18px;
          height: 18px;
          background: #f5576c;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 600;
        }

        .user-avatar {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 1.75rem;
          display: flex;
          gap: 1.25rem;
          transition: all 0.3s ease;
          animation: fadeInUp 0.5s ease forwards;
          opacity: 0;
        }

        .stat-card:nth-child(1) { animation-delay: 0.1s; }
        .stat-card:nth-child(2) { animation-delay: 0.2s; }
        .stat-card:nth-child(3) { animation-delay: 0.3s; }
        .stat-card:nth-child(4) { animation-delay: 0.4s; }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .stat-card:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.2);
          transform: translateY(-5px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
        }

        .stat-icon {
          width: 60px;
          height: 60px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .stat-content {
          flex: 1;
        }

        .stat-label {
          color: rgba(255, 255, 255, 0.5);
          font-size: 13px;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .stat-value {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .stat-change {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.4);
        }

        .stat-change.positive {
          color: #4ECDC4;
        }

        /* Action Bar */
        .action-bar {
          display: flex;
          gap: 1rem;
          margin-bottom: 2.5rem;
        }

        .primary-button {
          padding: 0.875rem 1.75rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 12px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
          font-size: 14px;
          box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
        }

        .primary-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(102, 126, 234, 0.4);
        }

        .secondary-button {
          padding: 0.875rem 1.75rem;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
          font-size: 14px;
        }

        .secondary-button:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.2);
        }

        /* Section */
        .section {
          margin-bottom: 3rem;
        }

        .section-title {
          font-size: 22px;
          font-weight: 700;
          margin-bottom: 1.5rem;
          color: rgba(255, 255, 255, 0.95);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        /* Projects Grid */
        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.5rem;
        }

        .project-card {
          background: rgba(255, 255, 255, 0.04);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 1.75rem;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .project-card:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.2);
          transform: translateY(-5px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
        }

        .project-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .project-color {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        }

        .card-menu-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: rgba(255, 255, 255, 0.6);
          transition: all 0.3s ease;
        }

        .card-menu-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .project-name {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .project-description {
          color: rgba(255, 255, 255, 0.6);
          font-size: 14px;
          margin-bottom: 1.5rem;
        }

        .project-progress {
          margin-bottom: 1.5rem;
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }

        .progress-label {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.5);
        }

        .progress-value {
          font-size: 13px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.9);
        }

        .progress-bar {
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          border-radius: 10px;
          transition: width 0.5s ease;
        }

        .project-meta {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: rgba(255, 255, 255, 0.6);
          font-size: 13px;
        }

        .project-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .deadline {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.5);
        }

        .view-button {
          background: transparent;
          border: none;
          color: #667eea;
          font-weight: 600;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.3s ease;
        }

        .view-button:hover {
          color: #764ba2;
        }

        /* Task Filters */
        .task-filters {
          display: flex;
          gap: 0.5rem;
        }

        .filter-btn {
          padding: 0.5rem 1rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: rgba(255, 255, 255, 0.6);
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .filter-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .filter-btn.active {
          background: rgba(102, 126, 234, 0.2);
          border-color: rgba(102, 126, 234, 0.4);
          color: white;
        }

        /* Tasks List */
        .tasks-list {
          display: flex;

.task-item {
  background: #111111;
  border: 1px solid #333333;
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  gap: 1.25rem;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(255, 255, 255, 0.1);
}

.task-item:hover {
  border-color: #444444;
  box-shadow: 0 4px 6px rgba(255, 255, 255, 0.1);
}

.task-status {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .task-content {
          flex: 1;
        }

        .task-title {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .task-description {
          color: rgba(255, 255, 255, 0.6);
          font-size: 14px;
          margin-bottom: 1rem;
        }

        .task-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 1.5rem;
          font-size: 13px;
        }

        .task-assignee,
        .task-files,
        .task-date {
          color: rgba(255, 255, 255, 0.5);
        }

        .task-priority {
          padding: 0.25rem 0.75rem;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
        }

        .priority-high {
          background: rgba(245, 87, 108, 0.2);
          color: #f5576c;
        }

        .priority-medium {
          background: rgba(255, 230, 109, 0.2);
          color: #FFE66D;
        }

        .priority-low {
          background: rgba(78, 205, 196, 0.2);
          color: #4ECDC4;
        }

        .task-actions {
          display: flex;
          gap: 0.5rem;
        }

        .task-action-btn {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: rgba(255, 255, 255, 0.6);
          transition: all 0.3s ease;
        }

        .task-action-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        /* Team Grid */
        .team-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .developer-card {
          background: rgba(255, 255, 255, 0.04);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 2rem;
          text-align: center;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .developer-card:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.2);
          transform: translateY(-5px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
        }

        .dev-avatar-large {
          width: 80px;
          height: 80px;
          border-radius: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 40px;
          margin: 0 auto 1rem;
          box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
        }

        .dev-name {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .dev-role {
          color: rgba(255, 255, 255, 0.5);
          font-size: 14px;
          margin-bottom: 1.5rem;
        }

        .dev-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1.5rem;
          padding: 1.25rem;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 12px;
        }

        .dev-stat {
          display: flex;
          flex-direction: column;
        }

        .dev-stat-value {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }

        .dev-stat-label {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
        }

        .availability-badge {
          display: inline-block;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 1.5rem;
        }

        .availability-badge.available {
          background: rgba(78, 205, 196, 0.2);
          color: #4ECDC4;
        }

        .availability-badge.busy {
          background: rgba(255, 230, 109, 0.2);
          color: #FFE66D;
        }

        .view-profile-btn {
          width: 100%;
          padding: 0.875rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .view-profile-btn:hover {
          background: rgba(102, 126, 234, 0.2);
          border-color: rgba(102, 126, 234, 0.4);
        }

        /* Modals */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal {
          width: 90%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .glass-modal {
          background: rgba(20, 25, 50, 0.95);
          backdrop-filter: blur(30px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 24px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }

        .modal-header {
          padding: 2rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-title {
          font-size: 24px;
          font-weight: 700;
        }

        .close-btn {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: rgba(255, 255, 255, 0.6);
          transition: all 0.3s ease;
        }

        .close-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .modal-body {
          padding: 2rem;
        }

        .modal-footer {
          padding: 1.5rem 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
        }

        /* Form Elements */
        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-label {
          display: block;
          margin-bottom: 0.75rem;
          font-size: 14px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.8);
        }

        .form-input,
        .form-textarea,
        .form-select {
          width: 100%;
          padding: 0.875rem 1rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          color: white;
          font-size: 14px;
          transition: all 0.3s ease;
        }

        .form-input:focus,
        .form-textarea:focus,
        .form-select:focus {
          outline: none;
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(102, 126, 234, 0.5);
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .form-textarea {
          resize: vertical;
          font-family: inherit;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .form-color {
          width: 100%;
          height: 50px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          cursor: pointer;
          background: rgba(255, 255, 255, 0.05);
        }

        .upload-btn {
          width: 100%;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.05);
          border: 2px dashed rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          color: rgba(255, 255, 255, 0.6);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
          font-weight: 500;
        }

        .upload-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(102, 126, 234, 0.5);
          color: white;
        }

        /* Developer Profile Modal */
        .developer-profile-modal {
          max-width: 700px;
        }

        .profile-header {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .profile-avatar {
          width: 70px;
          height: 70px;
          border-radius: 16px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 35px;
          box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
        }

        .profile-role {
          color: rgba(255, 255, 255, 0.5);
          font-size: 14px;
          margin-top: 0.25rem;
        }

        .profile-stats-row {
          display: grid;
          grid-template-columns: 1fr 1fr auto;
          gap: 2rem;
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 16px;
        }

        .profile-stat {
          text-align: center;
        }

        .profile-stat-value {
          display: block;
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .profile-stat-label {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.5);
        }

        /* Skills Section */
        .skills-section {
          margin-top: 2rem;
        }

        .skills-title {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 1.5rem;
        }

        .skills-list {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .skill-item {
          background: rgba(255, 255, 255, 0.03);
          padding: 1rem;
          border-radius: 12px;
        }

        .skill-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }

        .skill-name {
          font-weight: 600;
          font-size: 14px;
        }

        .skill-level {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.5);
        }

        .skill-bar-container {
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          overflow: hidden;
        }

        .skill-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
          border-radius: 10px;
          transition: width 0.5s ease;
        }

        /* Scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .sidebar {
            width: 240px;
          }

          .main-content {
            padding: 1.5rem 2rem;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .app-container {
            flex-direction: column;
          }

          .sidebar {
            width: 100%;
            padding: 1rem;
          }

          .logo {
            margin-bottom: 1.5rem;
          }

          .nav-menu {
            flex-direction: row;
            overflow-x: auto;
          }

          .main-content {
            padding: 1rem;
          }

          .header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .projects-grid,
          .team-grid {
            grid-template-columns: 1fr;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .task-meta {
            flex-direction: column;
            gap: 0.75rem;
          }
        }
      `}</style>
        </div>
    );
};

export default HarkDashboard;
