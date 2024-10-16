'use client';

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
import { AddWeightDialog } from "./add-weight-form";
import { format } from "date-fns";
import LazyLoadingSupabaseImage from "./common/lazy-loading-supabase-image";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Camera } from "lucide-react";
import { Button } from "./ui/button";

type WeightLogPageProps = {
  weightData?: Array<{ date: Date; weight: string ; photoUrl: string | null }>;
};
export default function WeightLogPage({
  weightData = [],
}: WeightLogPageProps) {
  console.log(weightData);
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-row justify-between">
        <h1 className="text-3xl font-bold">Weight Log</h1>
        <AddWeightDialog />
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
                    <span className="inline-flex gap-4 items-center">{format(log.date , 'PPP')}{log.photoUrl && (
                      <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline"><Camera /></Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Photo</DialogTitle>
                          <DialogDescription>
                            Here&apos;s the photo of your weight log
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                        <LazyLoadingSupabaseImage fullPath={log.photoUrl} alt={format(log.date, 'PPP')} width={200} height={200} />
                        </div>
                      </DialogContent>
                    </Dialog>
                      
                    )}</span>
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
