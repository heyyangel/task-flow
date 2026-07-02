"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTasksQuerySchema = exports.updateTaskSchema = exports.createTaskSchema = exports.TaskStatus = exports.TaskPriority = void 0;
const zod_1 = require("zod");
var TaskPriority;
(function (TaskPriority) {
    TaskPriority["LOW"] = "LOW";
    TaskPriority["MEDIUM"] = "MEDIUM";
    TaskPriority["HIGH"] = "HIGH";
})(TaskPriority || (exports.TaskPriority = TaskPriority = {}));
var TaskStatus;
(function (TaskStatus) {
    TaskStatus["TODO"] = "TODO";
    TaskStatus["IN_PROGRESS"] = "IN_PROGRESS";
    TaskStatus["DONE"] = "DONE";
})(TaskStatus || (exports.TaskStatus = TaskStatus = {}));
exports.createTaskSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1, "Title is required").max(100),
        description: zod_1.z.string().optional(),
        dueDate: zod_1.z.string().datetime().optional().or(zod_1.z.date().optional()),
        priority: zod_1.z.nativeEnum(TaskPriority).optional(),
        status: zod_1.z.nativeEnum(TaskStatus).optional(),
    }),
});
exports.updateTaskSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1).max(100).optional(),
        description: zod_1.z.string().optional(),
        dueDate: zod_1.z.string().datetime().optional().or(zod_1.z.date().optional()),
        priority: zod_1.z.nativeEnum(TaskPriority).optional(),
        status: zod_1.z.nativeEnum(TaskStatus).optional(),
    }),
    params: zod_1.z.object({
        id: zod_1.z.string().min(1, "Task ID is required"),
    }),
});
exports.getTasksQuerySchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.string().optional(),
        limit: zod_1.z.string().optional(),
        search: zod_1.z.string().optional(),
        status: zod_1.z.nativeEnum(TaskStatus).optional(),
        priority: zod_1.z.nativeEnum(TaskPriority).optional(),
        sortBy: zod_1.z.enum(["dueDate", "createdAt"]).optional(),
        sortOrder: zod_1.z.enum(["asc", "desc"]).optional(),
    }),
});
