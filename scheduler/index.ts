import chalk from "chalk";
import dayjs from "dayjs";
import { connect } from "mongoose";
import SchedItem from "./models/SchedItem";
import {
  searchCentresWithDistrict,
  searchCentresWithPincode,
} from "./searchCentres";
import sendMail from "./sendEmail";
import sendNotification, { IMessagePayload } from "./sendNotification";
import dotenv from "dotenv";
import { removeFromSchedule } from "./scheduler";

dotenv.config();

const SCHEDULE_TIME = 60 * 1000; // 1 minute
const SLEEP_TIME = 5 * 60 * 1000; // 5 minutes

async function main(): Promise<void> {
  try {
    console.log(
      chalk.green(`EXECUTING! @, ${dayjs().format("DD-MM-YYYY HH:mm:ss")}`)
    );
    const items = await SchedItem.find().sort({ startingDate: 1 }).limit(1);
    if (items.length) {
      const schedItem = items[0];
      const currentTime = dayjs();
      const scheduledTime = dayjs(schedItem.startingDate);
      const timeDiff = scheduledTime.diff(currentTime, "m", true);
      if (!(Math.abs(timeDiff) < 30.0)) {
        console.log(
          chalk.blue(`Time diff was way too much: ${timeDiff} minutes`)
        );
        if (timeDiff < 0) {
          // Remove if an item is long due and somehow managed to escape
          await removeFromSchedule(schedItem);
        }
        // If time is greater than 5 minutes skip. Let's check a minute later
        return;
      }
      if (schedItem.districtId != null) {
        const centersFound = await searchCentresWithDistrict(schedItem);
        if (centersFound === null || centersFound?.length === 0) {
          return;
        }
        if (schedItem.userSubscription != null) {
          const message: IMessagePayload = {
            token: schedItem.userSubscription,
            data: {
              centersFound: centersFound.map((e) => e.name).join(", "),
              count: centersFound.length.toString(),
              lastRunDate: dayjs().format("DD-MM-YYYY HH:mm:ss"),
            },
          };
          await sendNotification(message);
        }
        if (schedItem.email != null) {
          await sendMail(schedItem.email, {
            centers: centersFound,
            lastRunDate: new Date(),
          });
        }
      }
      if (schedItem.pincodes != null) {
        const centersFound = await searchCentresWithPincode(schedItem);
        if (centersFound === null || centersFound?.length === 0) {
          return;
        }
        if (schedItem.userSubscription != null) {
          const message: IMessagePayload = {
            token: schedItem.userSubscription,
            data: {
              centersFound: centersFound.map((e) => e.name).join(", "),
              count: centersFound.length.toString(),
              lastRunDate: dayjs().format("DD-MM-YYYY HH:mm:ss"),
            },
          };
          await sendNotification(message);
        }
        if (schedItem.email != null) {
          await sendMail(schedItem.email, {
            centers: centersFound,
            lastRunDate: new Date(),
          });
        }
      }
    }
    throw RangeError("We're out of schedules\n");
  } catch (e) {
    console.error("Error ocurred in the main function\n", e);
    throw e;
  }
}

async function driver(): Promise<void> {
  try {
    const beforeExecution = dayjs();
    await main();
    const afterExecution = dayjs();
    if (afterExecution.diff(beforeExecution, "minutes") >= 1) {
      // If the execution has exceeded 1 minute, then don't wait.
      // Immediately execute
      setImmediate(driver);
      return;
    }
    // Schedule it for the next minute
    setTimeout(driver, SCHEDULE_TIME);
  } catch (e) {
    console.error("Error ocurred while driving the repeat process\n", e);
    if (e instanceof RangeError) {
      // Do not throw this error which can be caught by init
      console.log(chalk.red(`GOING TO SLEEP FOR ${SLEEP_TIME}ms`));
      if (process.env.NODE_ENV !== "production") {
        setTimeout(driver, SCHEDULE_TIME);
        return;
      }
      setTimeout(driver, SLEEP_TIME);
      return;
    }
    throw e;
  }
}

async function init(): Promise<void> {
  try {
    const connectionURI =
      process.env.NODE_ENV === "production"
        ? process.env.MONGO_URI_STRING_PROD || ""
        : process.env.MONGO_URI_STRING_DEV || "";
    console.log(connectionURI);
    await connect(connectionURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await driver();
  } catch (e) {
    console.error("Error ocurred while initializing. Mostly mongoconnect\n", e);
    process.exit(1);
  }
}

init();
