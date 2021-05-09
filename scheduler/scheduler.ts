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
