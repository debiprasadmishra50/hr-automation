import express from "express";
import { postHello } from "../controller/controller";

const router = express.Router();

router.post("/test", postHello);

export default router;
