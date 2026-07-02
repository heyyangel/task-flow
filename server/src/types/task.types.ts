import { z } from "zod";

export enum TaskPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
}

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required").max(100),
    description: z.string().optional(),
    dueDate: z.string().datetime().optional().or(z.date().optional()),
    priority: z.nativeEnum(TaskPriority).optional(),
    status: z.nativeEnum(TaskStatus).optional(),
  }),
});

export const updateTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(100).optional(),
    description: z.string().optional(),
    dueDate: z.string().datetime().optional().or(z.date().optional()),
    priority: z.nativeEnum(TaskPriority).optional(),
    status: z.nativeEnum(TaskStatus).optional(),
  }),
  params: z.object({
    id: z.string().min(1, "Task ID is required"),
  }),
});

export const getTasksQuerySchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    search: z.string().optional(),
    status: z.nativeEnum(TaskStatus).optional(),
    priority: z.nativeEnum(TaskPriority).optional(),
    sortBy: z.enum(["dueDate", "createdAt"]).optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
  }),
});

export const aiSuggestSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required").max(100),
  }),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>["body"];
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>["body"];
export type AiSuggestInput = z.infer<typeof aiSuggestSchema>["body"];
