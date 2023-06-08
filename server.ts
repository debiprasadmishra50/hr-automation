import dotenv from "dotenv";
dotenv.config({ path: "./.env" }); // load the config.env file first
import { schedule } from "node-cron";

import app from "./app";
// import { main, sendQOD } from "./src/utils/main";

process.on("uncaughtException", (err: Error) => {
  console.log("UNCAUGHT EXCEPTION! Shutting Down...");
  console.log(err.name, err.message);
  process.exit(1);
});

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

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log("Server started on port: " + port);

  // qod.start();
  // dobAndDoj.start();
});

process.on("unhandledRejection", (err: Error) => {
  console.log("UNHANDLED REJECTION! Shutting Down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
