import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getTaskById } from "@/api/task.api";
import { TaskForm } from "@/components/TaskForm";
import { Skeleton } from "@/components/ui/skeleton";

export function TaskFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const { data: task, isLoading, isError } = useQuery({
    queryKey: ["task", id],
    queryFn: () => getTaskById(id!),
    enabled: isEdit,
  });

  if (isEdit && isLoading) {
    return (
      <div className="max-w-2xl w-full mx-auto space-y-6">
        <Skeleton className="h-12 w-1/3" />
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    );
  }

  if (isEdit && isError) {
    return (
      <div className="max-w-2xl w-full mx-auto p-8 text-center bg-destructive/10 text-destructive rounded-xl border border-destructive/20">
        <h3 className="font-semibold text-lg mb-2">Failed to load task</h3>
        <p>The task may have been deleted or doesn't exist.</p>
      </div>
    );
  }

  return <TaskForm initialData={task} isEdit={isEdit} />;
}
