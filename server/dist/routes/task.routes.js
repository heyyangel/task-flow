"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const task_controller_1 = require("../controllers/task.controller");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const task_types_1 = require("../types/task.types");
const router = (0, express_1.Router)();
// Protect all task routes
router.use(auth_middleware_1.protect);
router.route("/")
    .get(task_controller_1.getTasks)
    .post((0, validate_middleware_1.validate)(task_types_1.createTaskSchema), task_controller_1.createTask);
router.post("/ai-suggest", (0, validate_middleware_1.validate)(task_types_1.aiSuggestSchema), task_controller_1.suggestTaskDetails);
router.route("/:id")
    .get(task_controller_1.getTaskById)
    .put((0, validate_middleware_1.validate)(task_types_1.updateTaskSchema), task_controller_1.updateTask)
    .delete(task_controller_1.deleteTask);
exports.default = router;
