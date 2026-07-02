import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTaskById, deleteTask } from "@/api/task.api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ArrowLeft, Edit, Trash2, Calendar, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";

export function TaskDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: task, isLoading, isError } = useQuery({
    queryKey: ["task", id],
    queryFn: () => getTaskById(id!),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: () => {
      toast.success("Task deleted");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      navigate("/");
    },
    onError: () => {
      toast.error("Failed to delete task");
    },
  });

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteMutation.mutate(id!);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH": return "destructive";
      case "MEDIUM": return "warning";
      case "LOW": return "info";
      default: return "default";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DONE": return "success";
      case "IN_PROGRESS": return "info";
      case "TODO": return "secondary";
      default: return "default";
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex gap-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
        <Skeleton className="h-[300px] w-full rounded-xl" />
      </div>
    );
  }

  if (isError || !task) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20 bg-destructive/10 text-destructive rounded-xl border border-destructive/20">
        <AlertCircle className="mx-auto h-12 w-12 mb-4 opacity-50" />
        <h3 className="font-semibold text-xl mb-2">Task Not Found</h3>
        <p className="mb-6">The task you are looking for does not exist or has been deleted.</p>
        <Button asChild variant="outline">
          <Link to="/">Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
      
      <div className="flex items-center justify-between mb-8">
        <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Link>
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to={`/task/${task._id}/edit`}>
              <Edit className="mr-2 h-4 w-4" /> Edit Task
            </Link>
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden border-none shadow-lg">
        <div className="bg-primary/5 border-b p-8 flex flex-col md:flex-row gap-6 md:items-start justify-between">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">{task.title}</h1>
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant={getStatusColor(task.status) as any} className="text-sm px-3 py-1">
                {task.status.replace("_", " ")}
              </Badge>
              <Badge variant={getPriorityColor(task.priority) as any} className="text-sm px-3 py-1">
                {task.priority} Priority
              </Badge>
            </div>
          </div>
        </div>
        
        <CardContent className="p-8 space-y-8">
          <div>
            <h3 className="text-lg font-semibold mb-3">Description</h3>
            {task.description ? (
              <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {task.description}
              </p>
            ) : (
              <p className="text-muted-foreground italic opacity-50">No description provided.</p>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-6 pt-6 border-t">
            <div className="flex items-center text-muted-foreground">
              <Clock className="mr-3 h-5 w-5 text-primary/60" />
              <div>
                <p className="text-sm font-medium text-foreground">Created At</p>
                <p className="text-sm">{format(new Date(task.createdAt), "MMMM d, yyyy 'at' h:mm a")}</p>
              </div>
            </div>
            
            {task.dueDate && (
              <div className="flex items-center text-muted-foreground">
                <Calendar className="mr-3 h-5 w-5 text-primary/60" />
                <div>
                  <p className="text-sm font-medium text-foreground">Due Date</p>
                  <p className="text-sm">{format(new Date(task.dueDate), "MMMM d, yyyy")}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
