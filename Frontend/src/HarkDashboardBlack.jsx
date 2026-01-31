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
            color: '#3b82f6',
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
            color: '#10b981',
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
            color: '#f59e0b',
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
            case 'Completed': return '#10b981';
            case 'In Progress': return '#f59e0b';
            default: return '#6b7280';
        }
    };

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 border-r border-gray-800 fixed h-full">
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                            ⚡
                        </div>
                        <h1 className="text-xl font-bold">Hark</h1>
                    </div>

                    <nav className="space-y-2">
                        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-600 text-white">
                            <FolderKanban className="w-5 h-5" />
                            <span>Projects</span>
                        </button>
                        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 text-gray-300">
                            <Users className="w-5 h-5" />
                            <span>Team</span>
                        </button>
                        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 text-gray-300">
                            <FileCode className="w-5 h-5" />
                            <span>Files</span>
                        </button>
                        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 text-gray-300">
                            <Calendar className="w-5 h-5" />
                            <span>Calendar</span>
                        </button>
                    </nav>

                    <div className="mt-auto pt-8">
                        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 text-gray-300">
                            <Settings className="w-5 h-5" />
                            <span>Settings</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="ml-64 p-8">
                {/* Header */}
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-2">Project Dashboard</h2>
                        <p className="text-gray-400">Manage your team and track progress</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300">
                            <Search className="w-5 h-5" />
                        </button>
                        <button className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                            👤
                        </div>
                    </div>
                </header>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                                <FolderKanban className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Active Projects</p>
                                <h3 className="text-2xl font-bold text-white">{projects.length}</h3>
                                <p className="text-green-400 text-sm">+2 this month</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                                <Users className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Team Members</p>
                                <h3 className="text-2xl font-bold text-white">{developers.length}</h3>
                                <p className="text-green-400 text-sm">+1 this week</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-cyan-600 rounded-lg flex items-center justify-center">
                                <CheckCircle2 className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Tasks Completed</p>
                                <h3 className="text-2xl font-bold text-white">{tasks.filter(t => t.status === 'Completed').length}/{tasks.length}</h3>
                                <p className="text-green-400 text-sm">68% completion</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center">
                                <Clock className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">In Progress</p>
                                <h3 className="text-2xl font-bold text-white">{tasks.filter(t => t.status === 'In Progress').length}</h3>
                                <p className="text-gray-400 text-sm">Active tasks</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Bar */}
                <div className="flex gap-4 mb-8">
                    <button 
                        onClick={() => setShowCreateProject(true)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        New Project
                    </button>
                    <button 
                        onClick={() => setShowAddTask(true)}
                        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium flex items-center gap-2 border border-gray-700"
                    >
                        <Plus className="w-4 h-4" />
                        Add Task
                    </button>
                    <button 
                        onClick={() => setShowAddMember(true)}
                        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium flex items-center gap-2 border border-gray-700"
                    >
                        <Users className="w-4 h-4" />
                        Add Member
                    </button>
                </div>

                {/* Projects Grid */}
                <section className="mb-8">
                    <h3 className="text-xl font-bold text-white mb-6">Active Projects</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map(project => (
                            <div key={project.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors cursor-pointer">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-10 h-10 rounded-lg" style={{ backgroundColor: project.color }}></div>
                                    <button className="p-1 rounded hover:bg-gray-800">
                                        <ChevronDown className="w-4 h-4 text-gray-400" />
                                    </button>
                                </div>
                                <h4 className="text-lg font-semibold text-white mb-2">{project.name}</h4>
                                <p className="text-gray-400 text-sm mb-4">{project.description}</p>

                                <div className="mb-4">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-400">Progress</span>
                                        <span className="text-white font-medium">{project.progress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-800 rounded-full h-2">
                                        <div 
                                            className="h-2 rounded-full transition-all duration-300" 
                                            style={{ width: `${project.progress}%`, backgroundColor: project.color }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="flex justify-between text-sm text-gray-400 mb-4">
                                    <div className="flex items-center gap-1">
                                        <Users className="w-4 h-4" />
                                        <span>{project.members} members</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <CheckCircle2 className="w-4 h-4" />
                                        <span>{project.completedTasks}/{project.tasks} tasks</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center pt-4 border-t border-gray-800">
                                    <span className="text-sm text-gray-400">Due: {new Date(project.deadline).toLocaleDateString()}</span>
                                    <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">View →</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Tasks Section */}
                <section className="mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-white">Recent Tasks</h3>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm">All</button>
                            <button className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm">To-Do</button>
                            <button className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm">In Progress</button>
                            <button className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm">Completed</button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {tasks.map(task => (
                            <div key={task.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
                                <div className="flex gap-4">
                                    <div 
                                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                        style={{ backgroundColor: getStatusColor(task.status) }}
                                    >
                                        {getStatusIcon(task.status)}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-lg font-semibold text-white mb-2">{task.title}</h4>
                                        <p className="text-gray-400 text-sm mb-3">{task.description}</p>
                                        <div className="flex flex-wrap gap-4 text-sm">
                                            <span className="text-gray-400">👤 {task.assignee}</span>
                                            <span className="text-gray-400">📄 {task.files.length} files</span>
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                task.priority === 'High' ? 'bg-red-900 text-red-300' :
                                                task.priority === 'Medium' ? 'bg-amber-900 text-amber-300' :
                                                'bg-green-900 text-green-300'
                                            }`}>{task.priority}</span>
                                            <span className="text-gray-400">📅 {new Date(task.dueDate).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="p-2 rounded hover:bg-gray-800 text-gray-400">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 rounded hover:bg-gray-800 text-gray-400">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Team Members Section */}
                <section>
                    <h3 className="text-xl font-bold text-white mb-6">Team Members</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {developers.map(dev => (
                            <div key={dev.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors cursor-pointer">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center text-2xl mx-auto mb-4">
                                        {dev.avatar}
                                    </div>
                                    <h4 className="text-lg font-semibold text-white mb-1">{dev.name}</h4>
                                    <p className="text-gray-400 text-sm mb-4">{dev.role}</p>

                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div className="text-center">
                                            <div className="text-xl font-bold text-white">{dev.tasksCompleted}</div>
                                            <div className="text-xs text-gray-400">Tasks Done</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-xl font-bold text-white">{dev.activeProjects}</div>
                                            <div className="text-xs text-gray-400">Projects</div>
                                        </div>
                                    </div>

                                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 ${
                                        dev.availability === 'Available' ? 'bg-green-900 text-green-300' : 'bg-amber-900 text-amber-300'
                                    }`}>
                                        {dev.availability}
                                    </div>

                                    <button className="w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium">
                                        View Profile
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* Create Project Modal */}
            {showCreateProject && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowCreateProject(false)}>
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white">Create New Project</h3>
                            <button 
                                onClick={() => setShowCreateProject(false)}
                                className="p-2 rounded hover:bg-gray-800 text-gray-400"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Project Name</label>
                                <input 
                                    type="text" 
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                                    placeholder="Enter project name" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                                <textarea 
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                                    placeholder="Describe your project" 
                                    rows="3"
                                ></textarea>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Project Color</label>
                                    <input 
                                        type="color" 
                                        className="w-full h-10 bg-gray-800 border border-gray-700 rounded-lg"
                                        defaultValue="#3b82f6" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Deadline</label>
                                    <input 
                                        type="date" 
                                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button 
                                onClick={() => setShowCreateProject(false)}
                                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium"
                            >
                                Cancel
                            </button>
                            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">
                                Create Project
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HarkDashboard;
