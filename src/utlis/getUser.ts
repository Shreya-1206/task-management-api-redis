import { Request } from "express";

export const getUserId = (req: Request): string => {
  return (req as any).user.id.toString();
};
