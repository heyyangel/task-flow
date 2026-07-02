"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.getTaskById = exports.getTasks = exports.createTask = void 0;
const task_service_1 = require("../services/task.service");
const asyncHandler_1 = require("../utils/asyncHandler");
const ApiResponse_1 = require("../utils/ApiResponse");
const ApiError_1 = require("../utils/ApiError");
exports.createTask = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const task = await task_service_1.taskService.createTask(req.body);
    res.status(201).json(new ApiResponse_1.ApiResponse(201, "Task created successfully", task));
});
exports.getTasks = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { page, limit, search, status, priority, sortBy, sortOrder } = req.query;
    const result = await task_service_1.taskService.getTasks(page ? parseInt(page) : 1, limit ? parseInt(limit) : 10, search, status, priority, sortBy, sortOrder);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, "Tasks fetched successfully", result));
});
exports.getTaskById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const task = await task_service_1.taskService.getTaskById(req.params.id);
    if (!task) {
        throw new ApiError_1.ApiError(404, "Task not found");
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, "Task fetched successfully", task));
});
exports.updateTask = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const task = await task_service_1.taskService.updateTask(req.params.id, req.body);
    if (!task) {
        throw new ApiError_1.ApiError(404, "Task not found");
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, "Task updated successfully", task));
});
exports.deleteTask = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const task = await task_service_1.taskService.deleteTask(req.params.id);
    if (!task) {
        throw new ApiError_1.ApiError(404, "Task not found");
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, "Task deleted successfully", null));
});
