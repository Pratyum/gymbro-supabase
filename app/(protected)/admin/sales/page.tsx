"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Mock data for demonstration
const mockLeads = [
  {
    id: 1,
    source: "Website",
    status: "new",
    name: "John Doe",
    email: "john@example.com",
    phone: "123-456-7890",
    notes: "Interested in our product",
  },
  {
    id: 2,
    source: "Referral",
    status: "contacted",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "987-654-3210",
    notes: "Follow up next week",
  },
  // Add more mock leads as needed
];

export default function SalesPage() {
  const [leads, setLeads] = useState(mockLeads);
  const [filteredLeads, setFilteredLeads] = useState(mockLeads);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [selectedLead, setSelectedLead] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const filterLeads = () => {
    let filtered = leads;
    if (statusFilter !== "all") {
      filtered = filtered.filter((lead) => lead.status === statusFilter);
    }
    if (sourceFilter !== "all") {
      filtered = filtered.filter((lead) => lead.source === sourceFilter);
    }
    setFilteredLeads(filtered);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    filterLeads();
  };

  const handleSourceFilterChange = (value: string) => {
    setSourceFilter(value);
    filterLeads();
  };

  const handleCreateTask = (leadId: number, taskDescription: string) => {
    // Here you would typically make an API call to create a task
    console.log(`Created task for lead ${leadId}: ${taskDescription}`);
    // For demonstration, we'll just update the lead's notes
    const updatedLeads = leads.map((lead) =>
      lead.id === leadId
        ? { ...lead, notes: `${lead.notes}\nNew task: ${taskDescription}` }
        : lead,
    );
    setLeads(updatedLeads);
    setFilteredLeads(updatedLeads);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Sales</h1>
      <div className="flex gap-6">
        <aside className="w-64 bg-white/40 rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4">Filters</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="status-filter">Status</Label>
              <Select onValueChange={handleStatusFilterChange}>
                <SelectTrigger id="status-filter">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="source-filter">Source</Label>
              <Select onValueChange={handleSourceFilterChange}>
                <SelectTrigger id="source-filter">
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="Website">Website</SelectItem>
                  <SelectItem value="Referral">Referral</SelectItem>
                  <SelectItem value="Social Media">Social Media</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </aside>
        <section className="flex-1">
          <Card>
            <CardHeader>
              <CardTitle>Sales Pipeline</CardTitle>
              <CardDescription>Manage and track your leads</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell>{lead.name}</TableCell>
                      <TableCell>{lead.email}</TableCell>
                      <TableCell>{lead.phone}</TableCell>
                      <TableCell>{lead.source}</TableCell>
                      <TableCell>{lead.status}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedLead(lead)}
                            >
                              Create Task
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>
                                Create Task for {selectedLead?.name}
                              </DialogTitle>
                            </DialogHeader>
                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                const taskDescription =
                                  e.currentTarget.taskDescription.value;
                                if (selectedLead?.id) {
                                  if (selectedLead) {
                                    handleCreateTask(
                                      selectedLead.id,
                                      taskDescription,
                                    );
                                  }
                                }
                              }}
                            >
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="taskDescription">
                                    Task Description
                                  </Label>
                                  <Input
                                    id="taskDescription"
                                    placeholder="Enter task description"
                                  />
                                </div>
                                <Button type="submit">Create Task</Button>
                              </div>
                            </form>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
