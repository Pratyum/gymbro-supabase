'use client';

import {
  XAxis, CartesianGrid
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AddWeightDialog } from "./add-weight-form";
import { format, formatDate } from "date-fns";
import LazyLoadingSupabaseImage from "./common/lazy-loading-supabase-image";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Camera } from "lucide-react";
import { Button } from "./ui/button";

type WeightLogPageProps = {
  weightData?: Array<{ date: Date; weight: string ; photoUrl: string | null }>;
};

import { Area, AreaChart } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";

export const description = "A simple area chart"

const DEFAULT_CHART_CONFIG = {
  weight: {
    label: "Weight",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function MyAreaChart({chartData, chartConfig = DEFAULT_CHART_CONFIG , className}: {chartData: Array<{ date: string; weight: number }>, chartConfig?: ChartConfig , className?: ClassValue}) {
  return (
        <ChartContainer config={chartConfig}  className={cn("min-h-[200px] w-full", className)}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => formatDate(new Date(value), "MMM d")}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="weight"
              type="natural"
              fill="var(--color-weight)"
              fillOpacity={0.4}
              stroke="var(--color-weight)"
            />
          </AreaChart>
        </ChartContainer>
  )
}


export default function WeightLogPage({
  weightData = [],
}: WeightLogPageProps) {
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
           <MyAreaChart className="max-h-[300px]" chartData={weightData.map((log) => ({
              date: format(log.date, "yyyy MMM dd"),
              weight: parseFloat(log.weight),
           }))} />
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
