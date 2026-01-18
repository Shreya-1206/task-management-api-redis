import {Router} from "express";
import healthRoutes from "./health/health.routes"
import authRoutes from "./auth/auth.routes"
import taskRoutes from "./tasks/task.routes"

const router = Router();

router.use(healthRoutes);
router.use('/auth', authRoutes);
router.use("/tasks", taskRoutes);



export default router;