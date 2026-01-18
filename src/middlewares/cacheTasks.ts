import { Request, Response, NextFunction } from "express";
import { redisClient } from "../loaders/redis";

const CACHE_TTL = 60;

export const cacheUserTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = (req as any).user;

    if (!user) {
      return next();
    }

    const userId = user.id;
    const cacheKey = `tasks:user:${userId}`;

    const cachedTasks = await redisClient.get(cacheKey);

    if (cachedTasks) {
      console.log("⚡ Cache hit");

      return res.status(200).json({
        success: true,
        source: "cache",
        count: JSON.parse(cachedTasks).length,
        data: JSON.parse(cachedTasks),
      });
    }

    console.log("🐌 Cache miss");
    res.locals.cacheKey = cacheKey;
    res.locals.cacheTTL = CACHE_TTL;

    next();
  } catch (err) {
    console.error("Redis cache error:", err);
    next();
  }
};
