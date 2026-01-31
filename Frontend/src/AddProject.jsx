import React, { useState } from "react";
import Navbar from "./components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

function AddProjects() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        projectName: "",
        description: "",
        projectAdmin: "",
        createdBy: "",
        projectUsers: "",
        assignedFiles: "",
        fileSummaries: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Convert comma-separated values → arrays
        const newProject = {
            id: Date.now(),
            projectName: form.projectName,
            description: form.description,
            projectAdmin: form.projectAdmin,
            createdBy: form.createdBy,
            projectUsers: form.projectUsers.split(",").map(u => u.trim()),
            assignedFiles: form.assignedFiles.split(",").map(f => f.trim()),
            fileSummaries: form.fileSummaries,
        };

        console.log("New Project:", newProject);

        // Later: send to backend / context
        navigate("/");
    };

    return (
        <>
            <Navbar />

            <div className="container mx-auto p-6 max-w-xl">
                <Card>
                    <CardHeader>
                        <CardTitle>Add New Project</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">

                            <input
                                name="projectName"
                                placeholder="Project Name"
                                className="w-full border p-2 rounded"
                                onChange={handleChange}
                                required
                            />

                            <textarea
                                name="description"
                                placeholder="Project Description"
                                className="w-full border p-2 rounded"
                                onChange={handleChange}
                                required
                            />

                            <input
                                name="projectAdmin"
                                placeholder="Project Admin"
                                className="w-full border p-2 rounded"
                                onChange={handleChange}
                                required
                            />

                            <input
                                name="createdBy"
                                placeholder="Created By"
                                className="w-full border p-2 rounded"
                                onChange={handleChange}
                                required
                            />

                            <input
                                name="projectUsers"
                                placeholder="Project Users (comma separated)"
                                className="w-full border p-2 rounded"
                                onChange={handleChange}
                            />

                            <input
                                name="assignedFiles"
                                placeholder="Assigned Files (comma separated)"
                                className="w-full border p-2 rounded"
                                onChange={handleChange}
                            />

                            <textarea
                                name="fileSummaries"
                                placeholder="File summaries / notes"
                                className="w-full border p-2 rounded"
                                onChange={handleChange}
                            />

                            <Button type="submit" className="w-full">
                                Create Project
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

export default AddProjects;
