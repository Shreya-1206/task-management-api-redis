import { Request, Response } from "express";
import { TaskModel } from "../../models/task.model";
import { redisClient } from "../../loaders/redis";
import { getUserId } from "../../utlis/getUser";

export const getUserTasks = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);

    const tasks = await TaskModel.find({ user: userId }).sort({
      createdAt: -1,
    });

    // Store in Redis if cache middleware passed metadata
    if (res.locals.cacheKey && res.locals.cacheTTL) {
      await redisClient.setEx(
        res.locals.cacheKey,
        res.locals.cacheTTL,
        JSON.stringify(tasks)
      );
    }

    return res.status(200).json({
      success: true,
      source: "db",
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    console.error("Get Tasks Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch tasks",
    });
  }
};

/**
 * POST /api/tasks
 * Invalidates cache
 */
export const createTask = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const { title, description, status, priority } = req.body;

    const task = await TaskModel.create({
      title,
      description,
      status,
      priority,
      user: userId,
    });

    // Invalidate cache
    await redisClient.del(`tasks:user:${userId}`);

    return res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    console.error("Create Task Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create task",
    });
  }
};

/**
 * PUT /api/tasks/:taskId
 * Invalidates cache
 */
export const updateTask = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const { taskId } = req.params;

    const task = await TaskModel.findById(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Ownership check
    if (task.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not allowed",
      });
    }

    const allowedFields = ["title", "description", "status", "priority"];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        (task as any)[field] = req.body[field];
      }
    });

    await task.save();

    // Invalidate cache
    await redisClient.del(`tasks:user:${userId}`);

    return res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    console.error("Update Task Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update task",
    });
  }
};

/**
 * DELETE /api/tasks/:taskId
 * Invalidates cache
 */
export const deleteTask = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const { taskId } = req.params;

    const task = await TaskModel.findById(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Ownership check
    if (task.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not allowed",
      });
    }

    await task.deleteOne();

    // Invalidate cache
    await redisClient.del(`tasks:user:${userId}`);

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Delete Task Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete task",
    });
  }
};
