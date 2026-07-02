import type { Task } from "@/api/task.api";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { Calendar, Trash2, Edit, Eye } from "lucide-react";

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, onDelete }: TaskCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH": return "destructive";
      case "MEDIUM": return "warning";
      case "LOW": return "info";
      default: return "default";
    }
  };

  const getDueDateStatus = () => {
    if (!task.dueDate) return null;
    const dueDate = new Date(task.dueDate).setHours(0, 0, 0, 0);
    
    if (task.status === "DONE") {
      const completedAt = new Date(task.updatedAt).setHours(0, 0, 0, 0);
      if (completedAt > dueDate) {
        return { label: "Completed Late", class: "text-amber-600 bg-amber-500/10 border-amber-500/20" };
      }
      return { label: "Completed Early", class: "text-green-600 bg-green-500/10 border-green-500/20" };
    } else {
      const now = new Date().setHours(0, 0, 0, 0);
      if (now > dueDate) {
        return { label: "Overdue", class: "text-destructive bg-destructive/10 border-destructive/20" };
      }
      return null;
    }
  };

  const dateStatus = getDueDateStatus();

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 bg-card/80 backdrop-blur-sm border-muted/50 hover:border-primary/30 h-full flex flex-col">
      
      {/* Decorative gradient overlay that appears on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start gap-4">
          <CardTitle className="text-base font-semibold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {task.title}
          </CardTitle>
          <div className="flex flex-col gap-1.5 shrink-0 items-end">
            <Badge variant={getPriorityColor(task.priority) as any} className="text-[10px] px-2 py-0 h-5 font-semibold tracking-wider shadow-sm">
              {task.priority}
            </Badge>
            {dateStatus && (
              <Badge variant="outline" className={`text-[9px] px-1.5 py-0 h-4 border ${dateStatus.class}`}>
                {dateStatus.label}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-2 pb-2 flex-1">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {task.description || <span className="italic opacity-50">No description</span>}
        </p>
      </CardContent>
      
      <CardFooter className="p-4 pt-3 flex justify-between items-center border-t border-muted/30 bg-muted/10 mt-auto">
        <div className={`flex items-center text-xs font-medium ${dateStatus?.label === 'Overdue' ? 'text-destructive' : 'text-muted-foreground'}`}>
          <Calendar className="mr-1.5 h-3.5 w-3.5 opacity-70" />
          {task.dueDate ? format(new Date(task.dueDate), "MMM d, yyyy") : "No due date"}
        </div>
        
        {/* Actions that reveal on hover */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0">
          <Button variant="ghost" size="icon" asChild className="h-7 w-7 rounded-full hover:bg-primary/10 hover:text-primary">
            <Link to={`/task/${task._id}`}>
              <Eye className="h-3.5 w-3.5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild className="h-7 w-7 rounded-full hover:bg-primary/10 hover:text-primary">
            <Link to={`/task/${task._id}/edit`}>
              <Edit className="h-3.5 w-3.5" />
            </Link>
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7 rounded-full text-destructive/70 hover:text-destructive hover:bg-destructive/10" 
            onClick={(e) => {
              e.preventDefault();
              onDelete(task._id);
            }}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
