import axios from "axios";
import { sheets_v4 } from "googleapis";
// import { NINJA_API_KEY, QUOTE_API_KEY, SPREADSHEET_ID } from "./constants";
import { sendDOBEmail, sendDOJEmail } from "./sendEmail";
import { sendSlackMessage } from "./sendSlack";

/**
 * Fetches data from a Google Sheets API using the specified `sheets` service.
 * Retrieves employee information such as employee ID, full name, email, date of birth, date of joining, and job title.
 * @param sheets - The Google Sheets service object.
 * @returns A promise that resolves to an array containing the fetched data.
 */
export async function fetchData(sheets: sheets_v4.Sheets): Promise<any[]> {
  let empId_col = sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: "Sheet1!A:A", // specify the sheet name and range to read
  });
  let fullName_col = sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: "Sheet1!B:B", // specify the sheet name and range to read
  });
  let email_col = sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: "Sheet1!C:C", // specify the sheet name and range to read
  });
  let dob_col = sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: "Sheet1!D:D", // specify the sheet name and range to read
  });
  let doj_col = sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: "Sheet1!E:E", // specify the sheet name and range to read
  });
  let title_col = sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: "Sheet1!F:F", // specify the sheet name and range to read
  });

  let [empId, fullName, email, dob, doj, title] = await Promise.all([
    empId_col,
    fullName_col,
    email_col,
    dob_col,
    doj_col,
    title_col,
  ]);

  return [empId, fullName, email, dob, doj, title];
}

/**
 * Sends Happy Birthday emails to employees based on their indexes in the `dobIndexes` array.
 * Uses random quotes from the `quotes` array and chosen email templates for each employee.
 * @param dobIndexes - An array of indexes representing employees' dates of birth.
 * @param quotes - An array of quotes used in the email templates.
 * @param fullName - An array of employees' full names.
 * @param email - An array of employees' email addresses.
 */
export async function sendDOB(dobIndexes: number[], quotes: string[], fullName: string[], email: string[]) {
  for (const i of dobIndexes) {
    const chosenTemp = generateRandomNumber(1, 5);

    const quote = quotes[i <= 4 ? i : i % 4];

    await sendDOBEmail(fullName[i], email[i], formatString(quote), chosenTemp).catch(console.error);

    // await sendSlackMessage(`Happy Birthday ${fullName[i]} :birthday: :tada: :cake: :confetti_ball:
    //     \nHope this message will glorify this marvellous day!
    //     \n${quote}
    //     \nEnjoy the day ${fullName[i].split(" ")[0]}`).catch(console.error);

    // // console.log(`Happy Birthday ${fullName[i]} :birthday: :tada: :cake: :confetti_ball:
    // //     \nHope this message will glorify this marvellous day!
    // //     \n${quote}
    // //     \nEnjoy the day ${fullName[i].split(" ")[0]}`);

    // await wait(1);
  }
}

/**
 * Sends work anniversary emails to employees based on their indexes in the `dojIndexes` array.
 * Uses chosen email templates and relevant information for each employee.
 * @param dojIndexes - An array of indexes representing employees' dates of joining.
 * @param fullName - An array of employees' full names.
 * @param email - An array of employees' email addresses.
 * @param curTitle - An array of employees' current job titles.
 * @param doj - An array of employees' dates of joining.
 */
export async function sendDOJ(
  dojIndexes: number[],
  fullName: string[],
  email: string[],
  curTitle: string[],
  doj: string[]
) {
  const name: string[] = [];

  for (const i of dojIndexes) {
    const chosenTemp = generateRandomNumber(1, 5);

    await sendDOJEmail(fullName[i], email[i], curTitle[i], doj[i], chosenTemp).catch(console.error);
    // await wait(1);

    name.push(fullName[i]);

    // // console.log(`Congratulations on your Work Anniversary ${fullName[i]} ${fullName[i]} :technologist: :saluting_face: :clap: :partying_face: :confetti_ball:
    // //   \nEnjoy the day with a great smile on your face and wish you having more fun with us for upcoming years.`);

    // await wait(1);
  }

  await sendSlackMessage(`Congratulations on your Work Anniversary ${name.join(
    ", "
  )} :technologist: :saluting_face: :clap: :partying_face: :confetti_ball:
          \nEnjoy the day with a great smile on your face and wish you having more fun with us for upcoming years.`).catch(
    console.error
  );
}

/**
 * Retrieves the Quote of the Day (QOD) from a REST API.
 * @returns The quote of the day as a string.
 */
export async function getQuoteOfTheDay() {
  let qod: string = "";
  try {
    const res = await axios.get("https://quotes.rest/qod?language=en&category=inspire", {
      headers: {
        "X-TheySaidSo-Api-Secret": process.env.QUOTE_API_KEY,
      },
    });

    qod = res.data.contents.quotes[0].quote;

    // writeFileSync("./templates/qod.txt", qod, { encoding: "utf-8" });

    console.log("[+] Successfully fetched today's quote", getCurrentDate());

    return qod;
  } catch (err) {
    console.log("[-] Error getting today's quote:", err.message);
  }
}

type Cur = { quote: string; author: string; category: string };

/**
 * Retrieves multiple quotes from a specified category using a REST API.
 * @param category The category of quotes to retrieve.
 * @returns An array of quotes as strings.
 */
export async function getQuotes(category: string) {
  try {
    const res = await axios.get(`https://api.api-ninjas.com/v1/quotes?category=${category}&limit=5`, {
      headers: {
        "X-Api-Key": process.env.NINJA_API_KEY,
      },
    });

    const quotes: string[] = res.data.reduce((acc: string[], cur: Cur, i: number) => {
      acc.push(cur.quote);

      return acc;
    }, []);

    // writeFileSync("./templates/quote.txt", quotes.join("\n"), { encoding: "utf-8" });

    console.log("[+] Successfully fetched quotes", getCurrentDate());

    return quotes;
  } catch (err) {
    console.log("[-] Error getting today's quote:", err.message);
  }
}

/**
 * Flattens a nested array structure by removing nested arrays.
 * @param arr The array to be flattened.
 * @returns The flattened array.
 */
export const flatten = (arr: [][]): string[][] => arr.map((el: any) => el.data.values?.flat(1));

/**
 * Generates a random number between the specified minimum and maximum values (inclusive).
 * @param min The minimum value of the range.
 * @param max The maximum value of the range.
 * @returns The generated random number.
 */
export const generateRandomNumber = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * Retrieves the current date in the format DD-MMM.
 * @returns The current date as a string in the format DD-MMM.
 */
export function getCurrentDate() {
  const date = new Date();

  const day = date.getDate().toString().padStart(2, "0");
  const monthIndex = date.getMonth();

  const monthNames: string[] = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const month = monthNames[monthIndex];

  return `${day}-${month}`;
}

/**
 * Finds all occurrences of a given search string within an array of strings.
 * @param arr The array of strings to search within.
 * @param searchString The string to search for.
 * @returns An array of indexes where the search string was found.
 */
export function findStringOccurrences(arr: string[], searchString: string): number[] {
  return arr.reduce((acc: number[], curValue: string, index: number) => {
    if (curValue.includes(searchString)) acc.push(index);

    return acc;
  }, []);
}

/**
 * Waits for the specified number of seconds.
 *
 * @param secs - The number of seconds to wait.
 * @returns A promise that resolves with `true` after the specified number of seconds.
 */
export function wait(secs: number): Promise<boolean> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, secs * 1000);
  });
}

/**
 * Formats a string by surrounding it with "+" characters and applying specific formatting rules.
 * @param str The string to be formatted.
 * @returns The formatted string with proper borders, center alignment, and word wrapping.
 */
export function formatString(str: string): string {
  // Maximum line length and words per line
  const maxLineLength = 120;
  const maxWordsPerLine = 28;
  // Border character
  const borderChar = "#";

  // Split the string into words
  const words = str.trim().split(/\s+/);

  // Create an array to hold the formatted lines
  const lines: string[] = [];

  /**
   * Generates a formatted line with centered content.
   * @param content The content to be centered.
   * @returns The formatted line with centered content.
   */
  const generateLine = (content: string): string => {
    // Calculate the padding length
    const paddingLength = maxLineLength - content.length - 2;
    const leftPadding = Math.floor(paddingLength / 2);
    const rightPadding = Math.ceil(paddingLength / 2);
    // Construct the formatted line
    return `${borderChar}${" ".repeat(leftPadding)}${content}${" ".repeat(rightPadding)}${borderChar}`;
  };

  /**
   * Wraps words into paragraphs to fit within the line length.
   * @param words The words to be wrapped.
   * @returns The paragraphs containing the wrapped words.
   */
  const wrapWordsIntoParagraphs = (words: string[]): string[] => {
    const paragraphs: string[] = [];
    let currentLine = "";

    for (const word of words) {
      // Check if adding the current word exceeds the line length
      if ((currentLine + word).length > maxLineLength - 4) {
        // Add the current line to paragraphs and start a new line
        paragraphs.push(currentLine);
        currentLine = "";
      }
      // Append the word to the current line
      currentLine += `${word} `;
    }

    // Add the remaining line to paragraphs
    if (currentLine) {
      paragraphs.push(currentLine);
    }

    return paragraphs;
  };

  // Wrap words into paragraphs if necessary
  const paragraphs = wrapWordsIntoParagraphs(words);

  // Add the top border
  lines.push(borderChar.repeat(maxLineLength));

  // Add the content lines
  for (const paragraph of paragraphs) {
    const paragraphLines = Math.ceil(paragraph.length / maxLineLength);
    for (let i = 0; i < paragraphLines; i++) {
      const start = i * maxLineLength;
      const end = start + maxLineLength;
      const lineContent = paragraph.substring(start, end).trim();
      // Generate and add the formatted line
      lines.push(generateLine(lineContent));
    }
  }

  // Add the bottom border
  lines.push(borderChar.repeat(maxLineLength));

  // Join the lines and return the formatted string
  return lines.join("\n");
}
