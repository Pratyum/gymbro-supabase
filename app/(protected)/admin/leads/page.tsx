"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  BarChart,
  Users,
  DollarSign,
  ArrowUpRight,
  Upload,
} from "lucide-react";

// Mock data for demonstration
const mockLeads = [
  {
    id: 1,
    source: "Website",
    status: "New",
    name: "John Doe",
    email: "john@example.com",
    phone: "123-456-7890",
    notes: "Interested in membership",
    created_at: "2023-05-01",
  },
  {
    id: 2,
    source: "Facebook",
    status: "Contacted",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "987-654-3210",
    notes: "Requested tour",
    created_at: "2023-05-02",
  },
  {
    id: 3,
    source: "Referral",
    status: "Qualified",
    name: "Bob Johnson",
    email: "bob@example.com",
    phone: "456-789-0123",
    notes: "Ready for trial",
    created_at: "2023-05-03",
  },
  {
    id: 4,
    source: "Instagram",
    status: "New",
    name: "Alice Brown",
    email: "alice@example.com",
    phone: "789-012-3456",
    notes: "Interested in classes",
    created_at: "2023-05-04",
  },
];

export default function LeadManagement() {
  const [leads, setLeads] = useState(mockLeads);
  const [newSource, setNewSource] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleConnectSource = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to connect new source would go here
    alert(`Connected new source: ${newSource}`);
    setNewSource("");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleBulkImport = () => {
    // Logic for bulk import would go here
    if (file) {
      alert(`Importing leads from file: ${file.name}`);
      setFile(null);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Lead Management</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card className="bg-gradient-to-br from-purple-400 to-purple-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leads.length}</div>
            <p className="text-xs opacity-80">+20% from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-400 to-blue-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Conversion Rate
            </CardTitle>
            <BarChart className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15%</div>
            <p className="text-xs opacity-80">+2% from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-400 to-green-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$5,231</div>
            <p className="text-xs opacity-80">+10% from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-400 to-orange-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Now</CardTitle>
            <ArrowUpRight className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs opacity-80">+201 since last hour</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center mb-4">
        <Tabs defaultValue="leads" className="w-full">
          <div className="flex justify-between items-center">
            <TabsList className="bg-white bg-opacity-50 backdrop-blur-lg">
              <TabsTrigger
                value="leads"
                className="data-[state=active]:bg-purple-500 data-[state=active]:text-white"
              >
                Leads
              </TabsTrigger>
              <TabsTrigger
                value="sources"
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
              >
                Sources
              </TabsTrigger>
            </TabsList>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="emerald">
                  <Upload className="mr-2 h-4 w-4" /> Bulk Import
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Bulk Import Leads</DialogTitle>
                  <DialogDescription>
                    Upload a CSV file to import multiple leads at once.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="file" className="col-span-4">
                      CSV File
                    </Label>
                    <Input
                      id="file"
                      type="file"
                      onChange={handleFileUpload}
                      className="col-span-4"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleBulkImport}
                  className="w-full"
                  variant="emerald"
                >
                  Import Leads
                </Button>
              </DialogContent>
            </Dialog>
          </div>

          <TabsContent value="leads" className="space-y-4 mt-4">
            <div className="rounded-md border bg-white bg-opacity-50 backdrop-blur-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-bold">Name</TableHead>
                    <TableHead className="font-bold">Email</TableHead>
                    <TableHead className="font-bold">Phone</TableHead>
                    <TableHead className="font-bold">Source</TableHead>
                    <TableHead className="font-bold">Status</TableHead>
                    <TableHead className="font-bold">Created At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.map((lead) => (
                    <TableRow
                      key={lead.id}
                      className="hover:bg-purple-100 transition-colors"
                    >
                      <TableCell>{lead.name}</TableCell>
                      <TableCell>{lead.email}</TableCell>
                      <TableCell>{lead.phone}</TableCell>
                      <TableCell>{lead.source}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            lead.status === "New"
                              ? "bg-green-200 text-green-800"
                              : lead.status === "Contacted"
                                ? "bg-blue-200 text-blue-800"
                                : "bg-purple-200 text-purple-800"
                          }`}
                        >
                          {lead.status}
                        </span>
                      </TableCell>
                      <TableCell>{lead.created_at}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="sources" className="space-y-4 mt-4">
            <Card className="bg-white bg-opacity-50 backdrop-blur-lg">
              <CardHeader>
                <CardTitle>Connect New Source</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleConnectSource} className="space-y-4">
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="source">New Source</Label>
                    <Input
                      type="text"
                      id="source"
                      value={newSource}
                      onChange={(e) => setNewSource(e.target.value)}
                      placeholder="Enter source name"
                      className="bg-white"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-purple-500 to-blue-600 text-white hover:from-purple-600 hover:to-blue-700"
                  >
                    Connect Source
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
