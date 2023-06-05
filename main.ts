import "dotenv/config";
import { google, sheets_v4 } from "googleapis";
import { JWT } from "google-auth-library";
import {
  fetchData,
  findStringOccurrences,
  flatten,
  getCurrentDate,
  getQuoteOfTheDay,
  getQuotes,
  formatString,
  sendDOB,
  sendDOJ,
} from "./util";
import { deleteMessage, sendSlackMessage } from "./sendSlack";
import { schedule } from "node-cron";

async function main(): Promise<void> {
  const auth = new JWT({
    keyFile: `./${process.env.GOOGLE_KEY_FILE}`,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  const sheets: sheets_v4.Sheets = google.sheets({ version: "v4", auth });

  try {
    const quotes = await getQuotes("inspirational");

    const [empId_data, fullName_data, email_data, dob_data, doj_data, title_data]: any[] = await fetchData(
      sheets
    );

    const [empId, fullName, email, dob, doj, title] = flatten([
      empId_data,
      fullName_data,
      email_data,
      dob_data,
      doj_data,
      title_data,
    ]);

    const dobIndexes: number[] = findStringOccurrences(dob, getCurrentDate());
    const dojIndexes: number[] = findStringOccurrences(doj, getCurrentDate());

    // send DOB Emails
    if (dobIndexes.length) sendDOB(dobIndexes, quotes, fullName, email).catch(console.error);
    // if (dojIndexes.length) sendDOJ(dojIndexes, fullName, email, title, doj).catch(console.error);
  } catch (error) {
    console.error("[-] Error reading Google Sheets:", error);
    // console.error("[-] Error:", error.errors[0].message);
  }
}

async function sendQOD() {
  let qod = await getQuoteOfTheDay();

  qod = formatString(qod);

  await sendSlackMessage(`Dear Team, Good Morning!
        \nToday's Thought
        \n${qod}`);
}

// run at 08:45 AM everyday
const qod = schedule("45 8 * * *", async () => {
  console.log("[+] Cron QOD running at 08:45AM");

  await sendQOD();
});

// run at 09:00 AM everyday
const dobAndDoj = schedule("14 4 * * *", async () => {
  console.log("[+] Cron DOB+DOJ running at 09:00AM");

  await main();
});

qod.start();
dobAndDoj.start();

// qod.start();
// dobAndDoj.start();

// deleteMessage("1685572812.823279");

// sendSlackMessage(
//   `My fellow colleagues, as you are aware, I am undergoing development. Please ignore any test messages that you may receive from me for the next few days. I will inform you once I am ready.`
// ).catch(console.error);
