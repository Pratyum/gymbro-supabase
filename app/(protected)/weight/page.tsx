import { getAllWeightLogs } from "@/actions/weight-log";
import WeightLogPage from "@/components/weight-page";

export const metadata = {
  title: "Weight Tracker",
  description: "Track your weight with ease",
};

export default async function Weight() {
  const weightData = await getAllWeightLogs();
  return (
    <div className="space-y-4">
      <WeightLogPage weightData={weightData} />
    </div>
  );
}
