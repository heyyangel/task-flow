import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { suggestTaskDetails, createTask, updateTask } from "@/api/task.api";
import type { Task } from "@/api/task.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface TaskFormProps {
  initialData?: Task;
  isEdit?: boolean;
}

export const TaskForm = ({ initialData, isEdit }: TaskFormProps) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      dueDate: initialData?.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : "",
      priority: initialData?.priority || "MEDIUM",
      status: initialData?.status || "TODO",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title,
        description: initialData.description || "",
        dueDate: initialData.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : "",
        priority: initialData.priority,
        status: initialData.status,
      });
    }
  }, [initialData, reset]);

  const titleValue = watch("title");

  const suggestMutation = useMutation({
    mutationFn: (title: string) => suggestTaskDetails(title),
    onSuccess: (data) => {
      setValue("description", data.description, { shouldValidate: true, shouldDirty: true });
      setValue("priority", data.priority, { shouldValidate: true, shouldDirty: true });
      setApiError(null);
      toast.success("AI generated suggestions!");
    },
    onError: (error: any) => {
      setApiError(error?.response?.data?.message || "Failed to generate AI suggestions");
      toast.error("Failed to generate suggestions");
    },
  });

  const saveMutation = useMutation({
    mutationFn: (data: TaskFormValues) => {
      return isEdit && initialData 
        ? updateTask(initialData._id, data)
        : createTask(data);
    },
    onSuccess: () => {
      setApiError(null);
      toast.success(isEdit ? "Task updated successfully!" : "Task created successfully!");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      if (initialData?._id) {
        queryClient.invalidateQueries({ queryKey: ["task", initialData._id] });
      }
      navigate("/");
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || `Failed to ${isEdit ? "update" : "create"} task`;
      setApiError(msg);
      toast.error(msg);
    },
  });

  const onSubmit = (data: TaskFormValues) => {
    const payload = {
      ...data,
      dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
    };
    saveMutation.mutate(payload);
  };

  const handleSuggest = () => {
    if (!titleValue?.trim()) {
      toast.error("Please enter a title first.");
      return;
    }
    suggestMutation.mutate(titleValue);
  };

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm max-w-2xl w-full p-6 mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex items-center gap-4 mb-8 border-b pb-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex flex-col space-y-1">
          <h3 className="font-semibold leading-none tracking-tight text-2xl">
            {isEdit ? "Edit Task" : "Create Task"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {isEdit ? "Update your task details." : "Add a new task. Use AI to auto-fill details."}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {apiError && (
          <div className="bg-destructive/15 text-destructive text-sm p-4 rounded-md border border-destructive/20">
            {apiError}
          </div>
        )}
        
        <div className="space-y-3">
          <Label htmlFor="title" className="text-base">Title</Label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                id="title"
                placeholder="e.g. Fix login bug"
                {...register("title")}
                className="text-base h-11"
              />
              {errors.title && <p className="text-destructive text-xs mt-1">{errors.title.message}</p>}
            </div>
            <Button
              type="button"
              variant="secondary"
              onClick={handleSuggest}
              disabled={suggestMutation.isPending || !titleValue}
              className="sm:w-36 h-11 shadow-sm hover:shadow"
            >
              {suggestMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4 text-amber-500" />
              )}
              AI Suggest
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="description" className="text-base">Description</Label>
          <Textarea
            id="description"
            placeholder="Task description..."
            {...register("description")}
            rows={5}
            className="resize-y"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-6 bg-muted/20 p-4 rounded-lg border border-dashed">
          <div className="space-y-3">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              {...register("dueDate")}
              className="h-11 bg-background"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="priority">Priority</Label>
            <select
              id="priority"
              {...register("priority")}
              className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-shadow"
            >
              <option value="LOW">Low Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="HIGH">High Priority</option>
            </select>
          </div>

          <div className="space-y-3">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              {...register("status")}
              className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-shadow"
            >
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>
          </div>
        </div>

        <div className="pt-4 flex gap-4">
          <Button 
            type="submit" 
            className="flex-1 h-12 text-md font-medium"
            disabled={saveMutation.isPending}
          >
            {saveMutation.isPending && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            {saveMutation.isPending ? "Saving..." : (isEdit ? "Update Task" : "Save Task")}
          </Button>
        </div>
      </form>
    </div>
  );
};
