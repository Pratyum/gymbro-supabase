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
      <main className="flex-1 overflow-y-auto bg-gradient-to-b from-blue-100 to-purple-100 p-4 sm:p-6 lg:p-8">{children}</main>

      {/* Bottom navigation for mobile and tablet */}
      <BottomNavigation />
    </div>
  );
}
