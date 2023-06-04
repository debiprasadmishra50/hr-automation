import { Transporter, createTransport } from "nodemailer";
import { readFileSync } from "fs";
import Mail from "nodemailer/lib/mailer";
import {
  SMTP_PASSWORD,
  SMTP_PORT,
  SMTP_SERVER,
  SMTP_USER,
  TEST_PASSWORD,
  TEST_PORT,
  TEST_SMTP_SERVER,
  TEST_USER,
} from "./constants";

/**
 * Creates an SMTP transport using the provided configuration.
 * @returns An SMTP transporter instance.
 */
const createSMTPTransport = (): Transporter => {
  // Create a transporter using SMTP configuration
  // return createTransport({
  //   host: TEST_SMTP_SERVER,
  //   port: TEST_PORT,
  //   auth: {
  //     user: TEST_USER,
  //     pass: TEST_PASSWORD,
  //   },
  // });
  try {
    return createTransport({
      host: SMTP_SERVER,
      port: 465,
      // service: "gmail",
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASSWORD,
      },
    });
  } catch (err) {
    console.log(err.message);
  }
};

/**
 * The SMTP transport to be used for sending emails.
 */
const transport: Transporter = createSMTPTransport();

/**
 * Sends a birthday email to a recipient with personalized details.
 * @param fullName The full name of the recipient.
 * @param email The email address of the recipient.
 * @param quote The quote to include in the email.
 * @param templateNo The number of the email template to use.
 * @returns A promise that resolves once the email is sent successfully.
 */
export async function sendDOBEmail(
  fullName: string,
  email: string,
  quote: string,
  templateNo: number
): Promise<void> {
  try {
    // Read the email template from a file
    let emailTemplate = readFileSync(`./templates/dob/template-${templateNo}.txt`, { encoding: "utf-8" });

    // Replace placeholders in the email template with dynamic content
    emailTemplate = emailTemplate.replace("[Name]", fullName);
    emailTemplate = emailTemplate.replace("[Quote]", quote);

    // Configure the email details
    const mailOptions: Mail.Options = {
      // from: "debi@mail.com",
      from: SMTP_USER,
      to: email,
      // to: "debi@rapidinnovation.dev",
      subject: `Happy Birthday! ${fullName}`,
      text: emailTemplate,
      html: emailTemplate,
    };

    // Send the email
    const info = await transport.sendMail(mailOptions);

    console.log("[+] Email sent successfully");
    console.log("[+] Message ID:", info.messageId);
  } catch (error) {
    console.error("[-] Error sending email:", error);
  }
}

/**
 * Sends a work anniversary email to a recipient with personalized details.
 * @param fullName The full name of the recipient.
 * @param email The email address of the recipient.
 * @param currentTitle The current position or title of the recipient.
 * @param doj The date of joining of the recipient (in the format "YYYY-MM-DD").
 * @param templateNo The number of the email template to use.
 * @returns A promise that resolves once the email is sent successfully.
 */
export async function sendDOJEmail(
  fullName: string,
  email: string,
  currentTitle: string,
  doj: string,
  templateNo: number
): Promise<void> {
  try {
    // Read the email template from a file
    let emailTemplate = readFileSync(`./templates/doj/template-${templateNo}.txt`, { encoding: "utf-8" });

    // Replace placeholders in the email template with dynamic content
    emailTemplate = emailTemplate.replace("[Name]", fullName);
    emailTemplate = emailTemplate.replace("[Company]", "Rapid Innovation");
    emailTemplate = emailTemplate.replace("[Current Position/Title]", currentTitle);
    emailTemplate = emailTemplate.replace("[Date of Joining]", doj);
    emailTemplate = emailTemplate.replace("[number of years]", `${new Date().getFullYear() - +doj.slice(7)}`);

    // Configure the email details
    const mailOptions: Mail.Options = {
      // from: "debi@mail.com",
      from: "debi@rapidinnovation.dev",
      // to: email,
      to: "debi@rapidinnovation.dev",
      subject: `Congratulations on Your Work Anniversary! ${fullName}`,
      text: emailTemplate,
      html: emailTemplate,
      cc: "teamhr@rapidinnovation.dev",
    };

    // Send the email
    const info = await transport.sendMail(mailOptions);

    console.log("[+] Email sent successfully");
    console.log("[+] Message ID:", info.messageId);
  } catch (error) {
    console.error("[-] Error sending email:", error);
  }
}
