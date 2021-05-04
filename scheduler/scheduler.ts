import dayjs from "dayjs";
import SchedItem, { ISchedItem } from "./models/SchedItem";

export async function removeFromSchedule(
  schedItem: ISchedItem
): Promise<boolean> {
  try {
    await SchedItem.findByIdAndRemove(schedItem._id, {
      useFindAndModify: true,
    });
    return true;
  } catch (e) {
    console.error(`Error ocurred while removing by id: ${schedItem._id}\n`, e);
    return false;
  }
}

export async function scheduleNext(schedItem: ISchedItem): Promise<boolean> {
  try {
    const startingDateDayjs = dayjs(schedItem.startingDate);
    const endingDateDayjs = dayjs(schedItem.endingDate);
    const diff = endingDateDayjs.diff(startingDateDayjs, "hour");
    if (diff <= 0) {
      await removeFromSchedule(schedItem);
      return false;
    }
    if (diff < schedItem.repeatEvery) {
      await SchedItem.create({
        ...schedItem,
        startingDate: endingDateDayjs.toDate(),
      });
      await removeFromSchedule(schedItem);
      return true;
    }
    await SchedItem.create({
      ...schedItem,
      startingDate: dayjs(schedItem.startingDate)
        .add(schedItem.repeatEvery, "hour")
        .toDate(),
    });
    await removeFromSchedule(schedItem);
    return true;
  } catch (e) {
    console.error(
      `Error ocurred while scheduling the next item: ${schedItem._id}\n`,
      e
    );
    return false;
  }
}
