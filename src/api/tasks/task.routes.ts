import { Router } from "express";
import { createTask, getUserTasks , updateTask, deleteTask} from "./task.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { cacheUserTasks } from "../../middlewares/cacheTasks";


const router = Router();

// POST /api/tasks
router.post("/", authMiddleware, createTask);

// GET /api/tasks
router.get("/", authMiddleware, cacheUserTasks, getUserTasks);

router.put("/:taskId", authMiddleware, updateTask,);

router.delete("/:id", authMiddleware, deleteTask);

export default router;
