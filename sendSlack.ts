import "dotenv/config";
import { WebClient } from "@slack/web-api";
// import { BOT_OAUTH_TOKEN, GENERAL_CHANNEL_ID, USER_OAUTH_TOKEN } from "./constants";

// Create a new instance of WebClient with your Slack API credentials
const slack = new WebClient(process.env.BOT_OAUTH_TOKEN);

// export async function sendSlackMessage(channel: string, message: string): Promise<void> {
export async function sendSlackMessage(message: string): Promise<void> {
  try {
    // Call the chat.postMessage method to send a message to the channel
    const response = await slack.chat.postMessage({
      channel: process.env.GENERAL_CHANNEL_ID,
      text: message,
      //   as_user: true,
    });

    // const res = await slack.conversations.history({
    //   channel: GENERAL_CHANNEL_ID,
    //   token: USER_OAUTH_TOKEN,
    //   oldest: "1685228280",
    // });

    // const res = await slack.chat.delete({
    //   channel: GENERAL_CHANNEL_ID,
    //   ts: "1685228514.370859",
    // });

    // delete({
    //   channel: GENERAL_CHANNEL_ID,
    //   ts: "Happy Birthday Full Name",
    // });

    console.log("[+] Slack Message sent successfully");
    console.log("[+] Slack Message Response:", response.ok, "\tTS:", response.ts);
  } catch (error) {
    console.error("[-] Error sending message:", error);
  }
}

// Example usage:
// sendSlackMessage(GENERAL_CHANNEL_ID, "Hello from Debi Prasad as BOT :smiling_imp: @channel").catch(
//   console.error
// );
// sendSlackMessage(RANDOM_CHANNEL_ID, "Hello from Debi Prasad as BOT :smiling_imp: @channel").catch(
//   console.error
// );

// sendSlackMessage("Welcome to Rapid by Debi :smiling_imp: :partying_face:");

export async function deleteMessage(ts: string) {
  try {
    const res = await slack.chat.delete({
      channel: process.env.GENERAL_CHANNEL_ID,
      ts,
    });

    console.log("[+] Slack Message Deleted successfully", res.ok);
  } catch (error) {
    console.error("[-] Error sending message:", error);
  }
}
