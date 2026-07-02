import { Outlet, Link } from "react-router-dom";
import { CheckCircle2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export function DashboardLayout() {
  const { logout } = useAuth();
  return (
    <div className="min-h-screen relative selection:bg-primary/30">
      <header className="sticky top-0 z-50 w-full border-b bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">TaskFlow</span>
          </Link>
          
          <nav className="flex items-center gap-4">
            <Button variant="ghost" asChild className="hidden sm:inline-flex hover:bg-primary/10 hover:text-primary">
              <Link to="/">Dashboard</Link>
            </Button>
            <Button asChild className="rounded-full shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all">
              <Link to="/task/new">
                <Plus className="mr-2 h-4 w-4" /> New Task
              </Link>
            </Button>
            <Button variant="outline" size="sm" onClick={logout} className="rounded-full ml-2">
              Logout
            </Button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="animate-in fade-in duration-500">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
