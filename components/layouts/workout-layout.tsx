import { SidebarComponent } from "../common/side-bar";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";

type WorkoutLayoutProps = {
  children: React.ReactNode;
};

export default function WorkoutLayout({ children }: WorkoutLayoutProps) {
  return (
    <SidebarProvider>
      <div className="w-full flex flex-col md:flex-row h-screen bg-background">
        {/* Sidebar for laptop screens */}
        <SidebarComponent />

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-blue-100 to-purple-100 p-4 sm:p-6 lg:p-8">
          <SidebarTrigger />
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
