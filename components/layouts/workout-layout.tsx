import { Sidebar } from "../common/side-bar";
import { BottomNavigation } from "../common/bottom-navigation";

type WorkoutLayoutProps = {
  children: React.ReactNode;
};

export default function WorkoutLayout({ children }: WorkoutLayoutProps) {
  return (
    <div className="flex flex-col lg:flex-row h-screen bg-background">
      {/* Sidebar for laptop screens */}
      <Sidebar />

      {/* Main content area */}
      <main className="flex-1 overflow-y-auto p-4 lg:p-8">{children}</main>

      {/* Bottom navigation for mobile and tablet */}
      <BottomNavigation />
    </div>
  );
}
