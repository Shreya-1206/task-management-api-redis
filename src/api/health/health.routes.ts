import {healthCheck} from "./health.controller";
import {Router} from "express";

const route = Router();

route.get("/health", healthCheck);

export default route;