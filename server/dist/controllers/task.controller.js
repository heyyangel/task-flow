"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.suggestTaskDetails = exports.deleteTask = exports.updateTask = exports.getTaskById = exports.getTasks = exports.createTask = void 0;
const task_service_1 = require("../services/task.service");
const asyncHandler_1 = require("../utils/asyncHandler");
const ApiResponse_1 = require("../utils/ApiResponse");
const ApiError_1 = require("../utils/ApiError");
exports.createTask = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const task = await task_service_1.taskService.createTask({ ...req.body, userId: req.user.id });
    res.status(201).json(new ApiResponse_1.ApiResponse(201, "Task created successfully", task));
});
exports.getTasks = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { page, limit, search, status, priority, sortBy, sortOrder } = req.query;
    const result = await task_service_1.taskService.getTasks(req.user.id, page ? parseInt(page) : 1, limit ? parseInt(limit) : 10, search, status, priority, sortBy, sortOrder);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, "Tasks fetched successfully", result));
});
exports.getTaskById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const task = await task_service_1.taskService.getTaskById(req.params.id, req.user.id);
    if (!task) {
        throw new ApiError_1.ApiError(404, "Task not found");
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, "Task fetched successfully", task));
});
exports.updateTask = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const task = await task_service_1.taskService.updateTask(req.params.id, req.user.id, req.body);
    if (!task) {
        throw new ApiError_1.ApiError(404, "Task not found");
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, "Task updated successfully", task));
});
exports.deleteTask = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const task = await task_service_1.taskService.deleteTask(req.params.id, req.user.id);
    if (!task) {
        throw new ApiError_1.ApiError(404, "Task not found");
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, "Task deleted successfully", null));
});
exports.suggestTaskDetails = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { title } = req.body;
    // We dynamically import aiService so that if GEMINI_API_KEY is not set it doesn't fail at startup
    // but only when this endpoint is hit (though we check it in the service as well).
    const { aiService } = await Promise.resolve().then(() => __importStar(require("../services/ai.service")));
    const suggestion = await aiService.suggestTaskDetails(title);
    // Return just the JSON structure as required
    res.status(200).json(suggestion);
});
