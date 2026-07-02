import { Task, ITask } from "../models/task.model";
import { CreateTaskInput, UpdateTaskInput } from "../types/task.types";

export class TaskService {
  async createTask(taskData: CreateTaskInput & { userId: string }): Promise<ITask> {
    const task = new Task(taskData);
    return await task.save();
  }

  async getTasks(
    userId: string,
    page: number = 1,
    limit: number = 10,
    search?: string,
    status?: string,
    priority?: string,
    sortBy: string = "createdAt",
    sortOrder: "asc" | "desc" = "desc"
  ) {
    const query: any = { userId };

    if (search) {
      query.$text = { $search: search };
    }

    if (status) {
      query.status = status;
    }

    if (priority) {
      query.priority = priority;
    }

    const skip = (page - 1) * limit;

    const [tasks, total] = await Promise.all([
      Task.find(query)
        .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
        .skip(skip)
        .limit(limit),
      Task.countDocuments(query),
    ]);

    return {
      tasks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getTaskById(id: string, userId: string): Promise<ITask | null> {
    return await Task.findOne({ _id: id, userId });
  }

  async updateTask(id: string, userId: string, updateData: UpdateTaskInput): Promise<ITask | null> {
    return await Task.findOneAndUpdate({ _id: id, userId }, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async deleteTask(id: string, userId: string): Promise<ITask | null> {
    return await Task.findOneAndDelete({ _id: id, userId });
  }
}

export const taskService = new TaskService();
