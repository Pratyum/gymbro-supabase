"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { AddWeightForm } from "./add-weight-form";
import { format } from "date-fns";

// Mock data for the weight log
const initialWeightData = [
  { date: new Date("2023-05-01"), weight: '70' },
  { date: new Date("2023-05-08"), weight: '69.5' },
  { date: new Date("2023-05-15"), weight: '69' },
  { date: new Date("2023-05-22"), weight: '68.5' },
  { date: new Date("2023-05-29"), weight: '68.2' },
];

type WeightLogPageProps = {
  weightData?: Array<{ date: Date; weight: string }>;
};
export default function WeightLogPage({
  weightData = initialWeightData,
}: WeightLogPageProps) {

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-row justify-between">
        <h1 className="text-3xl font-bold">Weight Log</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Add Weight Log</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Weight Log</DialogTitle>
              <DialogDescription>
                Add your weight log to track your progress
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <AddWeightForm />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weight Progress</CardTitle>
          <CardDescription>Your weight journey over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={weightData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={["dataMin - 1", "dataMax + 1"]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {weightData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {weightData
                .slice(-5)
                .reverse()
                .map((log, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center border-b py-2 last:border-b-0"
                  >
                    <span>{format(log.date , 'PPP')}</span>
                    <span className="font-semibold">{log.weight} kg</span>
                  </li>
                ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
