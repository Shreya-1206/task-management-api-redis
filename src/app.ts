
import express from 'express';
import dotenv from 'dotenv';
import loaders from './loaders';

dotenv.config();

async function startServer () {
    const app = express();

  await loaders({ expressApp: app });

  const port = process.env.PORT || 4000;

  app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
  });
}

startServer();