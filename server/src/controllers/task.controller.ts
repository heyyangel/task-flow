import { Request, Response } from "express";
import { taskService } from "../services/task.service";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { AuthRequest } from "../middlewares/auth.middleware";

export const createTask = asyncHandler(async (req: AuthRequest, res: Response) => {
  const task = await taskService.createTask({ ...req.body, userId: req.user!.id });
  res.status(201).json(new ApiResponse(201, "Task created successfully", task));
});

export const getTasks = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page, limit, search, status, priority, sortBy, sortOrder } = req.query;

  const result = await taskService.getTasks(
    req.user!.id,
    page ? parseInt(page as string) : 1,
    limit ? parseInt(limit as string) : 10,
    search as string,
    status as string,
    priority as string,
    sortBy as string,
    sortOrder as "asc" | "desc"
  );

  res.status(200).json(new ApiResponse(200, "Tasks fetched successfully", result));
});

export const getTaskById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const task = await taskService.getTaskById(req.params.id as string, req.user!.id);
  
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  res.status(200).json(new ApiResponse(200, "Task fetched successfully", task));
});

export const updateTask = asyncHandler(async (req: AuthRequest, res: Response) => {
  const task = await taskService.updateTask(req.params.id as string, req.user!.id, req.body);
  
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  res.status(200).json(new ApiResponse(200, "Task updated successfully", task));
});

export const deleteTask = asyncHandler(async (req: AuthRequest, res: Response) => {
  const task = await taskService.deleteTask(req.params.id as string, req.user!.id);
  
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  res.status(200).json(new ApiResponse(200, "Task deleted successfully", null));
});

export const suggestTaskDetails = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { title } = req.body;
  
  // We dynamically import aiService so that if GEMINI_API_KEY is not set it doesn't fail at startup
  // but only when this endpoint is hit (though we check it in the service as well).
  const { aiService } = await import("../services/ai.service");
  
  const suggestion = await aiService.suggestTaskDetails(title);
  
  // Return just the JSON structure as required
  res.status(200).json(suggestion);
});
