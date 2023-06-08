import express from "express";
import { handleSlashCommandRequest, postHello } from "../controller/controller";

const router = express.Router();

router.get("/slack/command", handleSlashCommandRequest);

router.post("/test", postHello);

export default router;
