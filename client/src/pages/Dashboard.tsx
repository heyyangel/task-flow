import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTasks, deleteTask, updateTask } from "@/api/task.api";
import type { Task } from "@/api/task.api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Search, CheckCircle2, Circle, Clock, LayoutList, X } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { KanbanColumn } from "@/components/KanbanColumn";
import { TaskCard } from "@/components/TaskCard";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragStartEvent, DragEndEvent } from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";

export function Dashboard() {
  const queryClient = useQueryClient();
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["tasks", { search: debouncedSearch }],
    queryFn: () => getTasks({ search: debouncedSearch, limit: 100 }), 
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      const previousTasks = queryClient.getQueryData(["tasks", { search: debouncedSearch }]);
      
      queryClient.setQueryData(["tasks", { search: debouncedSearch }], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: {
            ...old.data,
            tasks: old.data.tasks.filter((t: Task) => t._id !== deletedId),
          }
        };
      });
      return { previousTasks };
    },
    onError: (_err, _newTodo, context) => {
      queryClient.setQueryData(["tasks", { search: debouncedSearch }], context?.previousTasks);
      toast.error("Failed to delete task");
    },
    onSuccess: () => {
      toast.success("Task deleted");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: Task["status"] }) => updateTask(id, { status }),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      const previousTasks = queryClient.getQueryData(["tasks", { search: debouncedSearch }]);
      
      queryClient.setQueryData(["tasks", { search: debouncedSearch }], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: {
            ...old.data,
            tasks: old.data.tasks.map((t: Task) => 
              t._id === id ? { ...t, status } : t
            ),
          }
        };
      });
      return { previousTasks };
    },
    onError: (_err, _newTodo, context) => {
      queryClient.setQueryData(["tasks", { search: debouncedSearch }], context?.previousTasks);
      toast.error("Failed to move task");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteMutation.mutate(id);
    }
  };

  const tasks: Task[] = data?.data?.tasks || [];
  
  // Calculate stats
  const total = tasks.length;
  const done = tasks.filter(t => t.status === "DONE").length;
  const inProgress = tasks.filter(t => t.status === "IN_PROGRESS").length;
  const todo = tasks.filter(t => t.status === "TODO").length;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find(t => t._id === active.id);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTask = tasks.find(t => t._id === activeId);
    if (!activeTask) return;

    // Handle dropping directly onto a column background
    if (overId === "TODO" || overId === "IN_PROGRESS" || overId === "DONE") {
      if (activeTask.status !== overId) {
        updateStatusMutation.mutate({ id: activeId, status: overId as Task["status"] });
        
        // Show due date notification if moving to DONE
        if (overId === "DONE" && activeTask.dueDate) {
          const dueDate = new Date(activeTask.dueDate).setHours(0, 0, 0, 0);
          const now = new Date().setHours(0, 0, 0, 0);
          if (now > dueDate) {
            toast.warning("Task completed, but it was overdue.");
          } else {
            toast.success("Task completed on time! 🚀");
          }
        }
      }
      return;
    }

    // Handle dropping onto another task to reorder/move
    const overTask = tasks.find(t => t._id === overId);
    if (overTask && activeTask.status !== overTask.status) {
      updateStatusMutation.mutate({ id: activeId, status: overTask.status });
      
      // Show due date notification if moving to DONE
      if (overTask.status === "DONE" && activeTask.dueDate) {
        const dueDate = new Date(activeTask.dueDate).setHours(0, 0, 0, 0);
        const now = new Date().setHours(0, 0, 0, 0);
        if (now > dueDate) {
          toast.warning("Task completed, but it was overdue.");
        } else {
          toast.success("Task completed on time! 🚀");
        }
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* Stats Section */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Tasks" value={total} icon={<LayoutList className="h-5 w-5 text-blue-500" />} />
        <StatCard title="To Do" value={todo} icon={<Circle className="h-5 w-5 text-secondary-foreground" />} />
        <StatCard title="In Progress" value={inProgress} icon={<Clock className="h-5 w-5 text-amber-500" />} />
        <StatCard title="Done" value={done} icon={<CheckCircle2 className="h-5 w-5 text-green-500" />} />
      </div>

      {/* Filters Section */}
      <div className="flex flex-col sm:flex-row gap-4 bg-card/60 backdrop-blur-sm p-4 rounded-2xl shadow-sm border border-muted/50">
        <div className="relative flex-1 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search tasks..." 
            className="pl-9 pr-9 bg-background/50 border-muted/50 shadow-inner focus-visible:ring-primary/30 transition-all rounded-xl" 
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          {searchInput && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full text-muted-foreground hover:text-foreground"
              onClick={() => setSearchInput("")}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>

      {/* Task Kanban Section */}
      {isError && (
        <div className="p-8 text-center bg-destructive/10 text-destructive rounded-xl border border-destructive/20">
          <h3 className="font-semibold text-lg mb-2">Failed to load tasks</h3>
          <p>Please check your connection or try again later.</p>
        </div>
      )}

      {isLoading ? (
        <div className="grid lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex flex-col space-y-4 bg-muted/30 p-4 rounded-xl">
              <div className="flex justify-between"><Skeleton className="h-6 w-24" /><Skeleton className="h-6 w-8 rounded-full" /></div>
              <Skeleton className="h-[200px] w-full rounded-xl" />
              <Skeleton className="h-[200px] w-full rounded-xl" />
            </div>
          ))}
        </div>
      ) : tasks.length === 0 && !isError && debouncedSearch === "" ? (
        <div className="text-center py-24 bg-card rounded-xl border border-dashed flex flex-col items-center justify-center">
          <LayoutList className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
          <h3 className="text-xl font-medium text-foreground">No tasks found</h3>
          <p className="text-muted-foreground mt-2 mb-6 max-w-sm">
            You don't have any tasks matching your filters, or you haven't created any yet.
          </p>
          <Button asChild>
            <Link to="/task/new">
              <Plus className="mr-2 h-4 w-4" /> Create your first task
            </Link>
          </Button>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid lg:grid-cols-3 gap-6 items-start">
            <KanbanColumn
              id="TODO"
              title="To Do"
              icon={<Circle className="h-5 w-5 text-secondary-foreground" />}
              tasks={tasks.filter(t => t.status === "TODO")}
              onDelete={handleDelete}
            />
            <KanbanColumn
              id="IN_PROGRESS"
              title="In Progress"
              icon={<Clock className="h-5 w-5 text-amber-500" />}
              tasks={tasks.filter(t => t.status === "IN_PROGRESS")}
              onDelete={handleDelete}
            />
            <KanbanColumn
              id="DONE"
              title="Done"
              icon={<CheckCircle2 className="h-5 w-5 text-green-500" />}
              tasks={tasks.filter(t => t.status === "DONE")}
              onDelete={handleDelete}
            />
          </div>
          
          <DragOverlay>
            {activeTask ? (
              <div className="rotate-2 scale-105 shadow-2xl cursor-grabbing opacity-90 w-full md:w-[350px]">
                <TaskCard task={activeTask} onDelete={() => {}} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      {/* Floating Action Button for mobile */}
      <Button 
        asChild 
        size="icon" 
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-xl hover:shadow-2xl transition-all lg:hidden z-50"
      >
        <Link to="/task/new">
          <Plus className="h-6 w-6" />
          <span className="sr-only">New Task</span>
        </Link>
      </Button>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string, value: number, icon: React.ReactNode }) {
  return (
    <Card className="hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 bg-card/80 backdrop-blur-sm border-muted/50 overflow-hidden relative group">
      <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full translate-x-8 -translate-y-8 group-hover:translate-x-4 group-hover:-translate-y-4 transition-transform duration-500" />
      <CardContent className="p-6 flex flex-row items-center justify-between relative z-10">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/60">{value}</p>
        </div>
        <div className="p-3 bg-background/80 shadow-sm border border-muted/50 rounded-xl backdrop-blur-md">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}
