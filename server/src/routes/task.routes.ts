import { Router } from "express";
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  suggestTaskDetails
} from "../controllers/task.controller";
import { validate } from "../middlewares/validate.middleware";
import { protect } from "../middlewares/auth.middleware";
import {
  createTaskSchema,
  updateTaskSchema,
  aiSuggestSchema
} from "../types/task.types";

const router = Router();

// Protect all task routes
router.use(protect);

router.route("/")
  .get(getTasks)
  .post(validate(createTaskSchema), createTask);

router.post("/ai-suggest", validate(aiSuggestSchema), suggestTaskDetails);

router.route("/:id")
  .get(getTaskById)
  .put(validate(updateTaskSchema), updateTask)
  .delete(deleteTask);

export default router;
