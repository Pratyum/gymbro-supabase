"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, User, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StepProps } from "@/types";

interface Client {
    id: number;
    name: string;
    email?: string;
    phoneNumber: string;
    role: string;
}

export function ClientSelectionStep({ data, onUpdate, onNext }: StepProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [clients] = useState<Client[]>([
        { id: 1, name: "John Doe", email: "john@example.com", phoneNumber: "+1234567890", role: "member" },
        { id: 2, name: "Jane Smith", email: "jane@example.com", phoneNumber: "+0987654321", role: "member" },
        { id: 3, name: "Mike Johnson", email: "mike@example.com", phoneNumber: "+1122334455", role: "member" },
    ]);

    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phoneNumber.includes(searchTerm)
    );

    const handleClientSelect = (client: Client) => {
        onUpdate({ client });
    };

    const handleNext = () => {
        if (data.client) {
            onNext();
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Select Client</h2>
                <p className="text-muted-foreground">
                    Choose the client you want to create a training program for
                </p>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                    placeholder="Search clients by name, email, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                />
            </div>

            <div className="grid gap-4 max-h-96 overflow-y-auto">
                {filteredClients.length === 0 ? (
                    <Card className="p-8 text-center">
                        <div className="space-y-4">
                            <User className="h-12 w-12 mx-auto text-muted-foreground" />
                            <div>
                                <h3 className="font-semibold">No clients found</h3>
                                <p className="text-sm text-muted-foreground">
                                    Try adjusting your search terms
                                </p>
                            </div>
                            <Button variant="outline" className="gap-2">
                                <Plus className="h-4 w-4" />
                                Add New Client
                            </Button>
                        </div>
                    </Card>
                ) : (
                    filteredClients.map((client) => (
                        <motion.div
                            key={client.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Card
                                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                                    data.client?.id === client.id
                                        ? "ring-2 ring-primary bg-primary/5"
                                        : "hover:bg-muted/50"
                                }`}
                                onClick={() => handleClientSelect(client)}
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-lg">{client.name}</CardTitle>
                                        <Badge variant="secondary">{client.role}</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <div className="space-y-2 text-sm text-muted-foreground">
                                        {client.email && (
                                            <div className="flex items-center gap-2">
                                                <span>📧</span>
                                                <span>{client.email}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2">
                                            <span>📱</span>
                                            <span>{client.phoneNumber}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))
                )}
            </div>

            {data.client && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-primary/10 rounded-lg border-2 border-primary/20"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold">Selected Client</h3>
                            <p className="text-sm text-muted-foreground">{data.client.name}</p>
                        </div>
                        <Button onClick={handleNext} className="gap-2">
                            Continue with {data.client.name}
                        </Button>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}