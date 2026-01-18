import { uptime } from "node:process"

export const healthCheck =(req:any,res:any) => {
  res.status(200).json({
    status: 'ok',
    uptime :process.uptime(),
    message:"Can connect to docker or kuber here"
  })
}