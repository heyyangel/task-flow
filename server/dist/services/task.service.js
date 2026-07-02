"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskService = exports.TaskService = void 0;
const task_model_1 = require("../models/task.model");
class TaskService {
    async createTask(taskData) {
        const task = new task_model_1.Task(taskData);
        return await task.save();
    }
    async getTasks(userId, page = 1, limit = 10, search, status, priority, sortBy = "createdAt", sortOrder = "desc") {
        const query = { userId };
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
            task_model_1.Task.find(query)
                .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
                .skip(skip)
                .limit(limit),
            task_model_1.Task.countDocuments(query),
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
    async getTaskById(id, userId) {
        return await task_model_1.Task.findOne({ _id: id, userId });
    }
    async updateTask(id, userId, updateData) {
        return await task_model_1.Task.findOneAndUpdate({ _id: id, userId }, updateData, {
            new: true,
            runValidators: true,
        });
    }
    async deleteTask(id, userId) {
        return await task_model_1.Task.findOneAndDelete({ _id: id, userId });
    }
}
exports.TaskService = TaskService;
exports.taskService = new TaskService();
