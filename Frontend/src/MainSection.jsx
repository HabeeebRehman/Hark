import React, { useState } from "react";
import Navbar from "./components/Navbar";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardAction,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Link } from "react-router-dom";

function MainSection() {
    const [cards, setCards] = useState([
        {
            id: 1,
            projectName: "Design System",
            title: "Design systems meetup",
            description:
                "A practical talk on component APIs, accessibility, and shipping faster.",
            image: "https://avatar.vercel.sh/shadcn1",
            badge: "Featured",

            projectAdmin: "Ram Narayan",
            createdBy: "Ram Narayan",

            projectUsers: ["Akhil", "Sneha", "Rohit"],
            assignedFiles: ["ui-guidelines.pdf", "tokens.json"],
            fileSummaries:
                "Contains reusable components, spacing system, and color tokens.",
        },
    ]);

    // Delete project
    const deleteCard = (id) => {
        setCards(cards.filter((card) => card.id !== id));
    };

    return (
        <>
            <Navbar />

            <div className="container mx-auto p-6">
                {/* Add Project Button */}
                <div className="mb-6">
                    <Link to="/add-project">
                        <Button variant="ghost">➕ Add Project</Button>
                    </Link>
                </div>

                {/* Project Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cards.map((card) => (
                        <Card
                            key={card.id}
                            className="relative mx-auto w-full max-w-sm overflow-hidden"
                        >
                            {/* Image Overlay */}
                            <div className="absolute inset-0 z-10 aspect-video bg-black/40" />
                            <img
                                src={card.image}
                                alt="Project cover"
                                className="relative z-0 aspect-video w-full object-cover brightness-75"
                            />

                            <CardHeader className="relative z-20">
                                <CardAction>
                                    <Badge variant="secondary">{card.badge}</Badge>
                                </CardAction>

                                <CardTitle>{card.projectName}</CardTitle>

                                <CardDescription>{card.description}</CardDescription>

                                {/* Extra Project Details */}
                                <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                                    <p>
                                        <strong>Admin:</strong> {card.projectAdmin}
                                    </p>
                                    <p>
                                        <strong>Created by:</strong> {card.createdBy}
                                    </p>
                                    <p>
                                        <strong>Users:</strong>{" "}
                                        {card.projectUsers.join(", ")}
                                    </p>
                                    <p>
                                        <strong>Assigned Files:</strong>{" "}
                                        {card.assignedFiles.join(", ")}
                                    </p>
                                    <p>
                                        <strong>Notes:</strong> {card.fileSummaries}
                                    </p>
                                </div>
                            </CardHeader>

                            <CardFooter className="flex gap-2">
                                <Button className="flex-1">View Project</Button>
                                <Button
                                    variant="destructive"
                                    className="flex-1"
                                    onClick={() => deleteCard(card.id)}
                                >
                                    Delete
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </>
    );
}

export default MainSection;
