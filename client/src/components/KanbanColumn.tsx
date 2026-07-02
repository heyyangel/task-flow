import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { SortableTaskCard } from "./SortableTaskCard";
import type { Task } from "@/api/task.api";
import { cn } from "@/utils";

interface KanbanColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  onDelete: (id: string) => void;
  icon?: React.ReactNode;
}

export function KanbanColumn({ id, title, tasks, onDelete, icon }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      type: "Column",
    },
  });

  return (
    <div className="flex flex-col h-full min-h-[500px]">
      <div className="flex items-center justify-between mb-4 px-1 group">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-background/50 shadow-sm border border-muted/50 backdrop-blur-sm">
            {icon}
          </div>
          <h3 className="font-semibold text-lg tracking-tight group-hover:text-primary transition-colors">{title}</h3>
        </div>
        <span className="bg-background/80 backdrop-blur-sm shadow-sm border border-muted/50 px-2.5 py-0.5 rounded-full text-sm font-medium">
          {tasks.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 bg-muted/20 backdrop-blur-sm rounded-2xl p-3 flex flex-col gap-4 border border-muted/30 shadow-inner transition-all duration-300",
          isOver && "bg-primary/5 border-primary/30 shadow-md ring-1 ring-primary/20"
        )}
      >
        <SortableContext
          items={tasks.map((task) => task._id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <SortableTaskCard key={task._id} task={task} onDelete={onDelete} />
          ))}
          {tasks.length === 0 && (
            <div className="h-24 border-2 border-dashed border-muted-foreground/20 rounded-xl flex items-center justify-center text-muted-foreground/50 text-sm">
              Drop tasks here
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  );
}
