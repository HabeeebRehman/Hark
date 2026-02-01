import React, { useState, useEffect } from 'react';
import { Plus, Users, FolderKanban, FileCode, Search, Bell, Settings, ChevronDown, Upload, X, Edit2, Trash2, Eye, Calendar, Clock, CheckCircle2, Circle, Loader, LogOut } from 'lucide-react';
import api from './lib/api';
import { useNavigate } from 'react-router-dom';

const HarkDashboard = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isManager = user.role === 'manager' || user.role === 'admin';
    const userId = user._id;

    const [activeProject, setActiveProject] = useState(null);
    const [showCreateProject, setShowCreateProject] = useState(false);
    const [showAddTask, setShowAddTask] = useState(false);
    const [showAddMember, setShowAddMember] = useState(false);
    const [showAddFile, setShowAddFile] = useState(false);
    const [selectedDeveloper, setSelectedDeveloper] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [filterStatus, setFilterStatus] = useState('All');

    const [projects, setProjects] = useState([]);
    const [developers, setDevelopers] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [workspaces, setWorkspaces] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form States
    const [newProjectData, setNewProjectData] = useState({
        name: '',
        description: '',
        color: '#3b82f6',
        deadline: ''
    });

    const [newTaskData, setNewTaskData] = useState({
        title: '',
        description: '',
        projectId: '',
        assignedTo: '',
        priority: 'Medium',
        dueDate: ''
    });

    const [newMemberData, setNewMemberData] = useState({
        userId: '',
        role: 'developer'
    });

    const [newFileData, setNewFileData] = useState({
        filename: '',
        url: '',
        projectId: '',
        summary: ''
    });


    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            // Fetch Workspaces
            const wsRes = await api.get('/workspaces');
            let workspaceData = wsRes.data;

            // Auto-create workspace if none exists
            if (workspaceData.length === 0) {
                 try {
                     const newWs = await api.post('/workspaces', { name: 'My Workspace' });
                     workspaceData = [newWs.data];
                 } catch (wsError) {
                     console.error("Failed to auto-create workspace", wsError);
                 }
            }

            setWorkspaces(workspaceData);

            // Fetch Developers (Users) FIRST to ensure we have them for mapping
            const usersRes = await api.get('/users');
            const mappedDevs = usersRes.data.map(u => ({
                id: u._id,
                name: u.username,
                role: u.role,
                avatar: '👤',
                skills: u.skills || [],
                tasksCompleted: 0, // Mock
                activeProjects: 0, // Mock
                availability: 'Available'
            }));
            setDevelopers(mappedDevs);

            if (workspaceData.length > 0) {
                const wsId = workspaceData[0]._id;
                
                // Fetch Projects for this workspace
                const projRes = await api.get(`/projects/workspace/${wsId}`);
                const backendProjects = projRes.data;

                // Map Projects
                const mappedProjects = backendProjects.map(p => ({
                    id: p._id,
                    name: p.name,
                    description: 'No description', 
                    color: '#3b82f6', 
                    progress: p.tasks.length > 0 
                        ? Math.round((p.tasks.filter(t => t && t.status === 'done').length / p.tasks.length) * 100) 
                        : 0,
                    members: p.developers ? p.developers.length : 0,
                    memberIds: p.developers ? p.developers.filter(d => d).map(d => d._id || d) : [], 
                    tasks: p.tasks ? p.tasks.length : 0,
                    completedTasks: p.tasks ? p.tasks.filter(t => t && t.status === 'done').length : 0,
                    deadline: p.endDate || new Date().toISOString()
                }));
                if (isManager) {
                    setProjects(mappedProjects);
                } else {
                    setProjects(mappedProjects.filter(p => p.memberIds.includes(userId)));
                }

                // Collect all tasks
                const allTasks = backendProjects.flatMap(p => (p.tasks || []).filter(t => t).map(t => {
                    // Robust assignee resolution: 
                    // 1. Try populated object
                    // 2. Try lookup in mappedDevs using ID
                    let assigneeName = 'Unassigned';
                    let assigneeId = null;

                    if (t.assignedTo) {
                        if (typeof t.assignedTo === 'object' && t.assignedTo.username) {
                            assigneeName = t.assignedTo.username;
                            assigneeId = t.assignedTo._id;
                        } else if (typeof t.assignedTo === 'string') {
                            const dev = mappedDevs.find(d => d.id === t.assignedTo);
                            if (dev) {
                                assigneeName = dev.name;
                            }
                            assigneeId = t.assignedTo;
                        }
                    }

                    return {
                        id: t._id,
                        title: t.title,
                        description: t.description || '',
                        status: t.status === 'done' ? 'Completed' : (t.status === 'in-progress' ? 'In Progress' : 'To-Do'),
                        assignee: assigneeName,
                        assigneeId: assigneeId,
                        files: [], 
                        priority: t.priority ? (t.priority.charAt(0).toUpperCase() + t.priority.slice(1)) : 'Medium',
                        dueDate: t.dueDate || new Date().toISOString(),
                        projectId: p._id, 
                        projectName: p.name
                    };
                }));

                if (isManager) {
                    setTasks(allTasks);
                } else {
                    // Developers see tasks in their projects OR assigned to them
                    setTasks(allTasks.filter(t => 
                        // Task is in a project they are a member of
                        mappedProjects.find(p => p.id === t.projectId)?.memberIds.includes(userId)
                    ));
                }
            }

        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
            if (error.response && error.response.status === 401) {
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [navigate]);

    const handleCreateProject = async () => {
        if (!newProjectData.name || workspaces.length === 0) {
            alert("Please enter a project name and ensure you have a workspace.");
            return;
        }

        try {
            const payload = {
                name: newProjectData.name,
                workspaceId: workspaces[0]._id, // Corrected from 'workspace' to 'workspaceId'
                endDate: newProjectData.deadline
            };

            const res = await api.post('/projects', payload);
            const newProject = res.data;

            // Optimistically add to state
            setProjects([...projects, {
                id: newProject._id,
                name: newProject.name,
                description: newProjectData.description || 'No description',
                color: newProjectData.color,
                progress: 0,
                members: 1, // Manager
                memberIds: [], // Initialize empty members
                tasks: 0,
                completedTasks: 0,
                deadline: newProject.endDate || new Date().toISOString()
            }]);

            setShowCreateProject(false);
            setNewProjectData({ name: '', description: '', color: '#3b82f6', deadline: '' });
            alert("Project created successfully!");
            fetchData(); // Refresh to ensure sync
        } catch (error) {
            console.error("Failed to create project", error);
            alert("Failed to create project: " + (error.response?.data?.message || error.message));
        }
    };

    const handleAddTask = async () => {
        if (!newTaskData.title || !newTaskData.projectId) {
            alert("Please enter a task title and select a project.");
            return;
        }

        try {
            const payload = {
                title: newTaskData.title,
                description: newTaskData.description,
                projectId: newTaskData.projectId, // Corrected from 'project' to 'projectId'
                assignedTo: isManager ? (newTaskData.assignedTo || undefined) : userId,
                priority: newTaskData.priority.toLowerCase(),
                dueDate: newTaskData.dueDate
            };

            const res = await api.post('/tasks', payload);
            const newTask = res.data;

            // Optimistically add to state
            setTasks([...tasks, {
                id: newTask._id,
                title: newTask.title,
                description: newTask.description || '',
                status: 'To-Do',
                assignee: newTask.assignedTo?.username || developers.find(d => d.id === newTask.assignedTo)?.name || 'Unassigned',
                assigneeId: newTask.assignedTo?._id || newTask.assignedTo || null,
                files: [],
                priority: newTask.priority ? (newTask.priority.charAt(0).toUpperCase() + newTask.priority.slice(1)) : 'Medium',
                dueDate: newTask.dueDate || new Date().toISOString(),
                projectId: newTaskData.projectId
            }]);

            // Update project task count locally
            setProjects(projects.map(p => 
                p.id === newTaskData.projectId 
                ? { ...p, tasks: p.tasks + 1 } 
                : p
            ));

            setShowAddTask(false);
            setNewTaskData({
                title: '',
                description: '',
                projectId: '',
                assignedTo: '',
                priority: 'Medium',
                dueDate: ''
            });
            alert("Task added successfully!");
            fetchData(); // Refresh to ensure sync
        } catch (error) {
            console.error("Failed to add task", error);
            alert("Failed to add task: " + (error.response?.data?.message || error.message));
        }
    };

    const handleAddFile = async () => {
        if (!newFileData.filename || !newFileData.projectId) {
            alert("Please enter a filename and select a project.");
            return;
        }

        try {
            await api.post(`/projects/${newFileData.projectId}/files`, {
                filename: newFileData.filename,
                url: newFileData.url || '#', // Mock URL if not provided
                summary: newFileData.summary,
                assignedTo: undefined // Optional
            });

            alert("File added successfully!");
            setShowAddFile(false);
            setNewFileData({ filename: '', url: '', projectId: '', summary: '' });
            fetchData(); // Refresh to show new file
        } catch (error) {
            console.error("Failed to add file", error);
            alert("Failed to add file: " + (error.response?.data?.message || error.message));
        }
    };

    const handleTaskStatusUpdate = async (taskId, newStatus) => {
        try {
            // Optimistic update
            setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));

            let backendStatus = 'todo';
            if (newStatus === 'Completed') backendStatus = 'done';
            else if (newStatus === 'In Progress') backendStatus = 'in-progress';
            else if (newStatus === 'To-Do') backendStatus = 'todo';

            await api.put(`/tasks/${taskId}`, { status: backendStatus });
            
            // Refresh data to ensure stats are correct
            fetchData();
        } catch (error) {
            console.error("Failed to update task status", error);
            alert("Failed to update task status");
            fetchData(); // Revert on error
        }
    };

    const handleAddMember = async () => {
        if (!newMemberData.userId || workspaces.length === 0) return;
        try {
            if (activeProject) {
                 // Add to Project
                 await api.post(`/projects/${activeProject}/assign`, {
                    userId: newMemberData.userId
                });
            } else {
                // Add to Workspace
                const workspaceId = workspaces[0]._id;
                await api.post(`/workspaces/${workspaceId}/members`, {
                    userId: newMemberData.userId,
                    role: newMemberData.role
                });
            }
            setShowAddMember(false);
            setNewMemberData({ userId: '', role: 'developer' });
            fetchData();
        } catch (error) {
            console.error("Failed to add member", error);
            alert("Failed to add member: " + (error.response?.data?.message || error.message));
        }
    };


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

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (loading) {
        return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;
    }

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
                        <button 
                            onClick={() => setActiveTab('overview')}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg ${activeTab === 'overview' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800 text-gray-300'}`}
                        >
                            <FolderKanban className="w-5 h-5" />
                            <span>Overview</span>
                        </button>
                        <button 
                            onClick={() => setActiveTab('projects')}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg ${activeTab === 'projects' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800 text-gray-300'}`}
                        >
                            <FolderKanban className="w-5 h-5" />
                            <span>Projects</span>
                        </button>
                        <button 
                            onClick={() => setActiveTab('team')}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg ${activeTab === 'team' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800 text-gray-300'}`}
                        >
                            <Users className="w-5 h-5" />
                            <span>Team</span>
                        </button>
                        <button 
                            onClick={() => setActiveTab('tasks')}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg ${activeTab === 'tasks' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800 text-gray-300'}`}
                        >
                            <CheckCircle2 className="w-5 h-5" />
                            <span>Tasks</span>
                        </button>
                        <button 
                            onClick={() => setActiveTab('files')}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg ${activeTab === 'files' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800 text-gray-300'}`}
                        >
                            <FileCode className="w-5 h-5" />
                            <span>Files</span>
                        </button>
                    </nav>

                    <div className="mt-auto pt-8">
                        <button 
                            onClick={() => setActiveTab('settings')}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg ${activeTab === 'settings' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800 text-gray-300'}`}
                        >
                            <Settings className="w-5 h-5" />
                            <span>Settings</span>
                        </button>
                        <button 
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 text-red-400 mt-2"
                        >
                            <LogOut className="w-5 h-5" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="ml-64 p-8">
                {/* Header */}
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <div className="flex items-center gap-4">
                            {activeProject && (
                                <button 
                                    onClick={() => setActiveProject(null)}
                                    className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300"
                                >
                                    <ChevronDown className="w-5 h-5 rotate-90" />
                                </button>
                            )}
                            <div>
                                <h2 className="text-3xl font-bold text-white mb-2">
                                    {activeProject ? projects.find(p => p.id === activeProject)?.name : (
                                        <>
                                            {activeTab === 'overview' && 'Dashboard Overview'}
                                            {activeTab === 'projects' && 'Projects'}
                                            {activeTab === 'team' && (isManager ? 'Workspace Members' : 'My Team')}
                                            {activeTab === 'tasks' && 'All Tasks'}
                                            {activeTab === 'files' && 'Project Files'}
                                            {activeTab === 'settings' && 'Settings'}
                                        </>
                                    )}
                                </h2>
                                <p className="text-gray-400">
                                    {activeProject ? 'Project Details & Management' : 'Manage your team and track progress'}
                                </p>
                            </div>
                        </div>
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
                {activeTab === 'overview' && (
                <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                                <FolderKanban className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">{activeProject ? 'Project Status' : 'Active Projects'}</p>
                                <h3 className="text-2xl font-bold text-white">
                                    {activeProject ? (projects.find(p => p.id === activeProject)?.progress + '%') : projects.length}
                                </h3>
                                <p className="text-green-400 text-sm">{activeProject ? 'Completion' : 'Current Workspace'}</p>
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
                                <h3 className="text-2xl font-bold text-white">
                                    {activeProject ? projects.find(p => p.id === activeProject)?.members : developers.length}
                                </h3>
                                <p className="text-green-400 text-sm">{activeProject ? 'Assigned' : 'Total Users'}</p>
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
                                <h3 className="text-2xl font-bold text-white">
                                    {activeProject 
                                        ? tasks.filter(t => t.projectId === activeProject && t.status === 'Completed').length
                                        : tasks.filter(t => t.status === 'Completed').length}
                                    /
                                    {activeProject 
                                        ? tasks.filter(t => t.projectId === activeProject).length
                                        : tasks.length}
                                </h3>
                                <p className="text-green-400 text-sm">{activeProject ? 'Project Tasks' : 'All Projects'}</p>
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
                                <h3 className="text-2xl font-bold text-white">
                                    {activeProject 
                                        ? tasks.filter(t => t.projectId === activeProject && t.status === 'In Progress').length
                                        : tasks.filter(t => t.status === 'In Progress').length}
                                </h3>
                                <p className="text-gray-400 text-sm">Active tasks</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Bar */}
                <div className="flex gap-4 mb-8">
                    {isManager && !activeProject && (
                        <button 
                            onClick={() => setShowCreateProject(true)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            New Project
                        </button>
                    )}
                    {isManager && (
                    <button 
                        onClick={() => {
                            setNewTaskData(prev => ({ ...prev, projectId: activeProject || '' }));
                            setShowAddTask(true);
                        }}
                        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium flex items-center gap-2 border border-gray-700"
                    >
                        <Plus className="w-4 h-4" />
                        Add Task
                    </button>
                    )}
                    {isManager && (
                    <button 
                        onClick={() => setShowAddMember(true)}
                        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium flex items-center gap-2 border border-gray-700"
                    >
                        <Users className="w-4 h-4" />
                        Add Member
                    </button>
                    )}
                    {activeProject && (
                         <button 
                            onClick={() => {
                                setNewFileData(prev => ({ ...prev, projectId: activeProject }));
                                setShowAddFile(true);
                            }}
                            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium flex items-center gap-2 border border-gray-700"
                        >
                            <Upload className="w-4 h-4" />
                            Upload File
                        </button>
                    )}
                </div>

                {/* Recent Items Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Projects - Hide if activeProject is set */}
                    {!activeProject && (
                    <section>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white">Recent Projects</h3>
                            <button onClick={() => setActiveTab('projects')} className="text-blue-400 hover:text-blue-300 text-sm font-medium">View All</button>
                        </div>
                        <div className="space-y-4">
                            {projects.slice(0, 3).map(project => (
                                <div key={project.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-colors flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white shrink-0" style={{ backgroundColor: project.color }}>
                                        <FolderKanban className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-white font-bold truncate">{project.name}</h4>
                                        <p className="text-gray-400 text-xs truncate">{project.tasks} Tasks • {project.progress}% Complete</p>
                                    </div>
                                    <button 
                                        onClick={() => {
                                            setActiveProject(project.id);
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                        className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                                    >
                                        View
                                    </button>
                                </div>
                            ))}
                            {projects.length === 0 && <p className="text-gray-500 italic">No projects yet.</p>}
                        </div>
                    </section>
                    )}

                    {/* Recent Tasks */}
                    <section className={activeProject ? "col-span-2" : ""}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white">{activeProject ? 'Project Tasks' : 'Recent Tasks'}</h3>
                            <div className="flex gap-2">
                                <button className="px-2 py-1 bg-gray-800 text-xs rounded text-gray-400">Todo</button>
                                <button className="px-2 py-1 bg-gray-800 text-xs rounded text-gray-400">Done</button>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {(activeProject ? tasks.filter(t => t.projectId === activeProject) : tasks).slice(0, 5).map(task => (
                                <div key={task.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-colors flex items-center gap-4">
                                    <div className="mt-1 shrink-0">
                                        {getStatusIcon(task.status)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-white font-bold text-sm truncate">{task.title}</h4>
                                        <p className="text-gray-400 text-xs truncate">{task.projectName} • {task.assignee}</p>
                                    </div>
                                    <div className={`px-2 py-0.5 rounded text-[10px] ${
                                        task.priority === 'High' ? 'bg-red-900 text-red-200' :
                                        task.priority === 'Medium' ? 'bg-yellow-900 text-yellow-200' :
                                        'bg-green-900 text-green-200'
                                    }`}>
                                        {task.priority}
                                    </div>
                                </div>
                            ))}
                            {tasks.length === 0 && <p className="text-gray-500 italic">No tasks yet.</p>}
                        </div>
                    </section>
                </div>
                </>
                )}

                {/* Projects View */}
                {activeTab === 'projects' && (
                    <div className="space-y-8">
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projects.map(project => (
                                <div key={project.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: project.color }}>
                                            <FolderKanban className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <h4 className="text-lg font-bold text-white mb-2">{project.name}</h4>
                                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-400">Progress</span>
                                                <span className="text-white">{project.progress}%</span>
                                            </div>
                                            <div className="w-full bg-gray-800 rounded-full h-2">
                                                <div 
                                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                    style={{ width: `${project.progress}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center pt-4 border-t border-gray-800">
                                            <span className="text-sm text-gray-400">Due: {new Date(project.deadline).toLocaleDateString()}</span>
                                            <button 
                                                onClick={() => {
                                                    setActiveProject(project.id);
                                                    setActiveTab('overview');
                                                }}
                                                className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                                            >
                                                Manage →
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {isManager && (
                            <button 
                                onClick={() => setShowCreateProject(true)}
                                className="bg-gray-900 border border-gray-800 border-dashed rounded-xl p-6 hover:border-blue-500 transition-colors flex flex-col items-center justify-center text-gray-400 hover:text-blue-500"
                            >
                                <Plus className="w-8 h-8 mb-2" />
                                <span>Create New Project</span>
                            </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Team View */}
                {activeTab === 'team' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold text-white">{activeProject ? 'Project Team' : (isManager ? 'Workspace Members' : 'My Team')}</h3>
                            {isManager && (
                            <button 
                                onClick={() => setShowAddMember(true)}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                <span>{activeProject ? 'Add to Project' : 'Add Member'}</span>
                            </button>
                            )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {(activeProject 
                                ? developers.filter(d => projects.find(p => p.id === activeProject)?.memberIds?.includes(d.id))
                                : (isManager 
                                    ? developers 
                                    : developers.filter(d => projects.some(p => p.memberIds.includes(d.id) && p.memberIds.includes(userId)))
                                  )
                            ).length === 0 ? (
                                <div className="col-span-full text-center py-10 text-gray-500">
                                    <p>No team members found.</p>
                                    <p className="text-sm mt-2">Add members to collaborate!</p>
                                </div>
                            ) : (
                                (activeProject 
                                    ? developers.filter(d => projects.find(p => p.id === activeProject)?.memberIds?.includes(d.id))
                                    : (isManager 
                                        ? developers 
                                        : developers.filter(d => projects.some(p => p.memberIds.includes(d.id) && p.memberIds.includes(userId)))
                                      )
                                ).map(dev => (
                                <div key={dev.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-2xl">
                                        {dev.avatar}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-white">{dev.name}</h4>
                                        <p className="text-sm text-gray-400 capitalize">{dev.role}</p>
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {dev.skills.slice(0, 3).map((skill, i) => (
                                                <span key={i} className="text-[10px] px-2 py-0.5 bg-gray-800 rounded text-gray-300">
                                                    {typeof skill === 'object' ? skill.name : skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )))}
                        </div>
                    </div>
                )}

                {/* Tasks View */}
                {activeTab === 'tasks' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white">Tasks</h3>
                            <div className="flex gap-2">
                                <button onClick={() => setFilterStatus('All')} className={`px-3 py-1 rounded-lg text-sm ${filterStatus === 'All' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300'}`}>All</button>
                                <button onClick={() => setFilterStatus('To-Do')} className={`px-3 py-1 rounded-lg text-sm ${filterStatus === 'To-Do' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300'}`}>To-Do</button>
                                <button onClick={() => setFilterStatus('In Progress')} className={`px-3 py-1 rounded-lg text-sm ${filterStatus === 'In Progress' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300'}`}>In Progress</button>
                                <button onClick={() => setFilterStatus('Completed')} className={`px-3 py-1 rounded-lg text-sm ${filterStatus === 'Completed' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300'}`}>Completed</button>
                                {isManager && (
                                <button 
                                    onClick={() => setShowAddTask(true)}
                                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center gap-1"
                                >
                                    <Plus className="w-3 h-3" />
                                    Add Task
                                </button>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            {tasks.filter(t => filterStatus === 'All' || t.status === filterStatus).length === 0 ? (
                                 <div className="text-gray-400 italic">No tasks found.</div>
                            ) : (
                                tasks.filter(t => filterStatus === 'All' || t.status === filterStatus).map(task => (
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
                                            <div className="flex flex-col gap-2">
                                                {task.status !== 'Completed' && (
                                                    <button onClick={() => handleTaskStatusUpdate(task.id, 'Completed')} className="p-2 rounded hover:bg-green-900 text-green-400" title="Mark as Done">
                                                        <CheckCircle2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <button className="p-2 rounded hover:bg-gray-800 text-gray-400">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 rounded hover:bg-gray-800 text-gray-400">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* Files View */}
                {activeTab === 'files' && (
                    <div className="space-y-6">
                         <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold text-white">Project Files</h3>
                             <button 
                                onClick={() => setShowAddFile(true)}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2"
                            >
                                <Upload className="w-4 h-4" />
                                Upload File
                            </button>
                        </div>
                        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-gray-800 text-gray-400 text-sm">
                                    <tr>
                                        <th className="p-4">Name</th>
                                        <th className="p-4">Project</th>
                                        <th className="p-4">Uploaded By</th>
                                        <th className="p-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-300">
                                    {projects.flatMap(p => (p.files || []).map(f => ({...f, projectName: p.name}))).length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="p-8 text-center text-gray-500 italic">
                                                No files found in this workspace.
                                            </td>
                                        </tr>
                                    ) : (
                                        projects.flatMap(p => (p.files || []).map(f => ({...f, projectName: p.name}))).map((file, idx) => (
                                            <tr key={idx} className="border-t border-gray-800 hover:bg-gray-800/50">
                                                <td className="p-4 font-medium">{file.filename}</td>
                                                <td className="p-4 text-gray-400">{file.projectName}</td>
                                                <td className="p-4 text-gray-400">{file.uploadedBy?.username || 'Unknown'}</td>
                                                <td className="p-4">
                                                    <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">Download</a>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

            {/* Add File Modal */}
            {showAddFile && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-gray-900 rounded-2xl w-full max-w-md border border-gray-800 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white">Upload File</h3>
                            <button onClick={() => setShowAddFile(false)} className="text-gray-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Filename</label>
                                <input 
                                    type="text" 
                                    className="w-full bg-black border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                    placeholder="e.g. Project Specs"
                                    value={newFileData.filename}
                                    onChange={(e) => setNewFileData({...newFileData, filename: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">File URL</label>
                                <input 
                                    type="text" 
                                    className="w-full bg-black border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                    placeholder="https://..."
                                    value={newFileData.url}
                                    onChange={(e) => setNewFileData({...newFileData, url: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Project</label>
                                <select 
                                    className="w-full bg-black border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                    value={newFileData.projectId}
                                    onChange={(e) => setNewFileData({...newFileData, projectId: e.target.value})}
                                >
                                    <option value="">Select Project</option>
                                    {projects.map(p => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Summary (Optional)</label>
                                <textarea 
                                    className="w-full bg-black border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 h-24 resize-none"
                                    placeholder="Brief description..."
                                    value={newFileData.summary}
                                    onChange={(e) => setNewFileData({...newFileData, summary: e.target.value})}
                                />
                            </div>
                            <button 
                                onClick={handleAddFile}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg mt-4"
                            >
                                Upload File
                            </button>
                        </div>
                    </div>
                </div>
            )}

                {/* Settings View */}
                {activeTab === 'settings' && (
                    <div className="max-w-2xl">
                        <h3 className="text-xl font-bold text-white mb-6">Settings</h3>
                        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Workspace Name</label>
                                <input 
                                    type="text" 
                                    value={workspaces[0]?.name || ''} 
                                    readOnly
                                    className="w-full bg-black border border-gray-800 rounded-lg px-4 py-2 text-white"
                                />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Your Profile</label>
                                <div className="flex items-center gap-4 p-4 bg-black rounded-lg border border-gray-800">
                                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl">
                                        👤
                                    </div>
                                    <div>
                                        <p className="text-white font-bold">{(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user'))?.username : 'User')}</p>
                                        <p className="text-gray-400 text-sm">{(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user'))?.email : 'No email')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Projects Grid Removed */}
                
                {/* Team Members Section Removed */}
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
                                    value={newProjectData.name}
                                    onChange={(e) => setNewProjectData({...newProjectData, name: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                                <textarea 
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                                    placeholder="Describe your project" 
                                    rows="3"
                                    value={newProjectData.description}
                                    onChange={(e) => setNewProjectData({...newProjectData, description: e.target.value})}
                                ></textarea>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Project Color</label>
                                    <input 
                                        type="color" 
                                        className="w-full h-10 bg-gray-800 border border-gray-700 rounded-lg"
                                        value={newProjectData.color}
                                        onChange={(e) => setNewProjectData({...newProjectData, color: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Deadline</label>
                                    <input 
                                        type="date" 
                                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                                        value={newProjectData.deadline}
                                        onChange={(e) => setNewProjectData({...newProjectData, deadline: e.target.value})}
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
                            <button 
                                onClick={handleCreateProject}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                            >
                                Create Project
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Task Modal */}
            {showAddTask && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowAddTask(false)}>
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white">Add New Task</h3>
                            <button onClick={() => setShowAddTask(false)} className="p-2 rounded hover:bg-gray-800 text-gray-400">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                                <input 
                                    type="text" 
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                                    placeholder="Task title"
                                    value={newTaskData.title}
                                    onChange={(e) => setNewTaskData({...newTaskData, title: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                                <textarea 
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                                    placeholder="Task description"
                                    rows="2"
                                    value={newTaskData.description}
                                    onChange={(e) => setNewTaskData({...newTaskData, description: e.target.value})}
                                ></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Project</label>
                                <select 
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                                    value={newTaskData.projectId}
                                    onChange={(e) => setNewTaskData({...newTaskData, projectId: e.target.value})}
                                >
                                    <option value="">Select a project</option>
                                    {projects.map(p => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Assignee</label>
                                    <select 
                                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                                        value={isManager ? newTaskData.assignedTo : userId}
                                        onChange={(e) => setNewTaskData({...newTaskData, assignedTo: e.target.value})}
                                        disabled={!newTaskData.projectId || !isManager}
                                    >
                                        <option value="">Unassigned</option>
                                        {(newTaskData.projectId 
                                            ? developers.filter(d => projects.find(p => p.id === newTaskData.projectId)?.memberIds?.includes(d.id))
                                            : []
                                        ).map(d => (
                                            <option key={d.id} value={d.id}>{d.name}</option>
                                        ))}
                                    </select>
                                    {!newTaskData.projectId && <p className="text-xs text-gray-500 mt-1">Select a project to see members</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
                                    <select 
                                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                                        value={newTaskData.priority}
                                        onChange={(e) => setNewTaskData({...newTaskData, priority: e.target.value})}
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Due Date</label>
                                <input 
                                    type="date" 
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                                    value={newTaskData.dueDate}
                                    onChange={(e) => setNewTaskData({...newTaskData, dueDate: e.target.value})}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button onClick={() => setShowAddTask(false)} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium">Cancel</button>
                            <button onClick={handleAddTask} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">Add Task</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Member Modal */}
            {showAddMember && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowAddMember(false)}>
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white">{activeProject ? 'Add to Project' : 'Add Team Member'}</h3>
                            <button onClick={() => setShowAddMember(false)} className="p-2 rounded hover:bg-gray-800 text-gray-400">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Select User</label>
                                <select 
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                                    value={newMemberData.userId}
                                    onChange={(e) => setNewMemberData({...newMemberData, userId: e.target.value})}
                                >
                                    <option value="">Select a user to add</option>
                                    {developers.map(d => (
                                        <option key={d.id} value={d.id}>{d.name} ({d.role})</option>
                                    ))}
                                </select>
                            </div>
                            {!activeProject && (
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                                <select 
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                                    value={newMemberData.role}
                                    onChange={(e) => setNewMemberData({...newMemberData, role: e.target.value})}
                                >
                                    <option value="developer">Developer</option>
                                    <option value="admin">Admin</option>
                                    <option value="manager">Manager</option>
                                </select>
                            </div>
                            )}
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button onClick={() => setShowAddMember(false)} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium">Cancel</button>
                            <button onClick={handleAddMember} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">{activeProject ? 'Add to Project' : 'Add Member'}</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default HarkDashboard;