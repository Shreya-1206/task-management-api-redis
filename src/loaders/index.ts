import express from 'express';
import expressLoader from "./express";
import mongooseLoader from "./mongoose";
import { connectRedis } from "./redis"

export default async ({ expressApp }: { expressApp: express.Application }) => {
  console.log('📦 Loaders initialized');

  await connectRedis(); 

  // - DB loader 1
  await mongooseLoader()
  
  //Express loaded // - Express loader (middleware + routes) 2
  await expressLoader({ app: expressApp });
  
  // For now, nothing else
  // Later we will add:
  
  
};
