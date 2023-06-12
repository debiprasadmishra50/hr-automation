import { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
// import { handleSlashCommand } from "src/utils/util";
import { WebClient } from "@slack/web-api";

// Create a new instance of WebClient with your Slack API credentials
const slack = new WebClient(process.env.BOT_OAUTH_TOKEN);

export const postHello = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body);

  let { text } = req.body;

  text = text.toUpperCase();

  res.status(200).json(text);
});
