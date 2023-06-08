import { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
// import { handleSlashCommand } from "src/utils/util";
import { WebClient } from "@slack/web-api";

// Create a new instance of WebClient with your Slack API credentials
const slack = new WebClient(process.env.BOT_OAUTH_TOKEN);

export const handleSlashCommandRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const text = req.body.text;
    handleSlashCommand(text).then(() => {
      res.sendStatus(200);
    });
    // 1. Get Data Data from collection
    // 2. Build template
    // 3. Render that template
    res.status(200).json({ status: "success", data: "hello" });
  }
);

export async function handleSlashCommand(text: string): Promise<void> {
  try {
    const response = await processMessage(text);
    await slack.chat.postMessage({
      channel: process.env.RANDOM_CHANNEL_ID, // Update with the desired channel or recipient
      text: response,
    });
  } catch (error) {
    console.error("Error processing message:", error);
  }
}

async function processMessage(message: string): Promise<string> {
  return message.toUpperCase();
}

export const postHello = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    status: "success",
    data: "Hello",
  });
});
