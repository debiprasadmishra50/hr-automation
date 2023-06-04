/**
 * Formats a string by surrounding it with "+" characters and applying specific formatting rules.
 * @param str The string to be formatted.
 * @returns The formatted string with proper borders, center alignment, and word wrapping.
 */
function formatString(str: string): string {
  // Maximum line length and words per line
  const maxLineLength = 120;
  const maxWordsPerLine = 28;
  // Border character
  const borderChar = "+";

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

// Test values
const string1 = "Short string";
const string2 =
  "A longer string that exceeds the maximum line length and needs to be wrapped into paragraphs";
const string3 =
  "A very long string that is more than 200 characters. It needs to be wrapped into multiple lines and paragraphs to fit within the specified formatting rules.";
const string4 =
  "This is an even longer string that exceeds 400 characters and requires extensive wrapping into paragraphs to maintain proper formatting. The goal is to ensure that the output adheres to the specified guidelines without any compromise.";

// Format the strings
const formattedString1 = formatString(string1);
const formattedString2 = formatString(string2);
const formattedString3 = formatString(string3);
const formattedString4 = formatString(string4);

// Output the formatted strings
console.log("Formatted String 1:");
console.log(formattedString1);
console.log("\nFormatted String 2:");
console.log(formattedString2);
console.log("\nFormatted String 3:");
console.log(formattedString3);
console.log("\nFormatted String 4:");
console.log(formattedString4);

const string5 =
  "This is an example string with 700 characters. It is a long string that exceeds the maximum line length and needs to be wrapped into paragraphs to maintain proper formatting. The goal is to ensure that the output adheres to the specified guidelines without any compromise.This is an example string with 700 characters. It is a long string that exceeds the maximum line length and needs to be wrapped into paragraphs to maintain proper formatting. The goal is to ensure that the output adheres to the specified guidelines without any compromise.This is an example string with 700 characters. It is a long string that exceeds the maximum line length and needs to be wrapped into paragraphs to maintain proper formatting. The goal is to ensure that the output adheres to the specified guidelines without any compromise.";

const formattedString5 = formatString(string5);

console.log("\nFormatted String 5:");
console.log(formattedString5);
