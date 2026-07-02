import { Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { Dashboard } from "@/pages/Dashboard";
import { TaskFormPage } from "@/pages/TaskFormPage";
import { TaskDetails } from "@/pages/TaskDetails";
import { Login } from "@/pages/Login";
import { Signup } from "@/pages/Signup";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/task/new" element={<TaskFormPage />} />
        <Route path="/task/:id" element={<TaskDetails />} />
        <Route path="/task/:id/edit" element={<TaskFormPage />} />
      </Route>
    </Routes>
  );
}

export default App;
