import "dotenv/config";
import { WebClient, WebAPICallResult } from "@slack/web-api";
import { createEventAdapter } from "@slack/events-api";

// Create a new instance of WebClient with your Slack API credentials
const slack = new WebClient(process.env.BOT_OAUTH_TOKEN);
const slackEvents = createEventAdapter(process.env.SIGNING_SECRET);

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
    console.error("[-] Error sending slack message:", error);
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

// const port = +process.env.PORT || 3000;
// // Start the server
// slackEvents.start(port).then(() => {
//   console.log(`[+] Slack Server listening on port ${port}`);
// });

// // Listen for 'message' events
// slackEvents.on("message", async (event) => {
//   if (event.type === "message" && event.text && event.text.startsWith("/im")) {
//     const inputText = event.text.substring(4).trim(); // Extract the text after '/im'

//     const responseText = inputText.toUpperCase(); // Convert the input text to uppercase

//     // Send the response back to the Slack channel
//     await slack.chat.postMessage({
//       channel: event.channel,
//       text: responseText,
//     });
//   }
// });
