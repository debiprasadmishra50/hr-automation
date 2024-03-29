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
  generateRandomNumber,
} from "./src/utils/util";
import { deleteMessage, sendSlackMessage } from "./src/utils/sendSlack";
import { schedule } from "node-cron";

export async function main(): Promise<void> {
  const auth = new JWT({
    keyFile: `./${process.env.GOOGLE_KEY_FILE}`,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  const sheets: sheets_v4.Sheets = google.sheets({ version: "v4", auth });

  try {
    // const quote: string = await getQuotes("inspirational");

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

    const curDate = getCurrentDate();

    const dobIndexes: number[] = findStringOccurrences(dob, curDate);
    const dojIndexes: number[] = findStringOccurrences(doj, curDate);

    // console.log(dobIndexes);

    // send DOB Emails
    if (dobIndexes.length) sendDOB(dobIndexes, fullName, email).catch(console.error);
    if (dojIndexes.length) sendDOJ(dojIndexes, fullName, email, title, doj).catch(console.error);
  } catch (error) {
    console.error("[-] Error reading Google Sheets:", error);
    // console.error("[-] Error:", error.errors[0].message);
  }
}

// main();

export async function sendQOD() {
  const categories = [
    "inspirational",
    "intelligence",
    "knowledge",
    "life",
    "success",
    "happiness",
    "hope",
    "freedom",
    "failure",
    // "family",
    "dreams",
    "health",
    "imagination",
  ];
  const randomEl = generateRandomNumber(0, categories.length - 1);
  let { quote, author } = await getQuotes(categories[randomEl]);

  // qod = formatString(qod, 80, 15);

  // console.log(`Dear Team, Good Morning!
  //       \nToday's Thought
  //       \n${quote}
  //       \n -- ${author}`);

  await sendSlackMessage(`Dear Team, Good Morning!
        \nToday's Thought
        \n${quote}
        \n -- ${author}`);
}

// // run at 08:45 AM everyday
// const qod = schedule("15 3 * * *", async () => {
//   console.log("[+] Cron QOD running at 08:45AM");

//   await sendQOD();
// });

// // run at 09:00 AM everyday
// // UTC Time
// const dobAndDoj = schedule("30 3 * * *", async () => {
//   console.log("[+] Cron DOB+DOJ running at 09:00AM");

//   await main();
// });

// qod.start();
// dobAndDoj.start();

/* 

  // deleteMessage("1685572812.823279");

  // sendSlackMessage(
  //   `My fellow colleagues, as you are aware, I am undergoing development. Please ignore any test messages that you may receive from me for the next few days. I will inform you once I am ready.`
  // ).catch(console.error);
  
*/
