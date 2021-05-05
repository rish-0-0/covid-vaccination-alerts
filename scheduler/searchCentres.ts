import { ISchedItem } from "./models/SchedItem";
import dayjs from "dayjs";
import axios from "axios";
import { removeFromSchedule, scheduleNext } from "./scheduler";

const cowinAPI = axios.create({ baseURL: "https://cdn-api.co-vin.in/api" });

interface ISession {
  capacity: number;
  date: string;
  minAgeLimit: number;
  sessionId: string;
  vaccineType: string;
}

export interface ICenter {
  blockName: string;
  id: number;
  districtName: string;
  paid: boolean;
  lat: number;
  long: number;
  name: string;
  pincode: number;
  stateName: string;
  sessions: Array<ISession>;
}
/**
 * This function performs additional sideffects related to schedule
 * collection modification
 * @param schedItem is an item in the schedule collection
 * @return centers
 */
export async function searchCentresWithDistrict(
  schedItem: ISchedItem
): Promise<ICenter[] | null> {
  try {
    if (schedItem.districtId == null) {
      await removeFromSchedule(schedItem);
      return null;
    }
    const allCenters: ICenter[] = [];
    const startingFormattedDate = dayjs(schedItem.startingDate).format(
      "DD-MM-YYYY"
    );
    const {
      data: { centers },
    } = await cowinAPI.get(
      `/v2/appointment/sessions/public/calendarByDistrict?date=${startingFormattedDate}&district_id=${schedItem.districtId}`
    );
    if (!Array.isArray(centers)) {
      await removeFromSchedule(schedItem);
      return null;
    }
    const formattedCenters: ICenter[] = centers.map((e: any) => {
      return {
        blockName: e.block_name,
        stateName: e.state_name,
        districtName: e.district_name,
        id: e.center_id,
        name: e.name,
        lat: e.lat,
        long: e.long,
        pincode: parseInt(e.pincode),
        paid: e.fee_type === "Free" ? false : true,
        sessions: e.sessions.map((session: any) => {
          return {
            capacity: session.available_capacity,
            minAgeLimit: session.min_age_limit,
            vaccineType: session.vaccine,
            date: dayjs(session.date, "DD-MM-YYYY").toDate(),
            sessionId: session.session_id,
          };
        }),
      };
    });
    allCenters.push(...formattedCenters);
    if (allCenters.length === 0) {
      await scheduleNext(schedItem);
    }
    // Now check for the schedItems request permissions and send appropriate notifications
    allCenters.filter((center: any) => {
      let isAllowed = false;
      center.sessions.forEach((session: any) => {
        if (
          minAgeSatisfied(session, schedItem) ||
          paidAmountSatisfied(session, schedItem) ||
          vaccineTypeSatisfied(session, schedItem) ||
          numberOfSlotsGreaterThanSatisfied(session, schedItem)
        ) {
          isAllowed = true;
        }
      });
      return isAllowed;
    });
    // Now if there's any centers left even after filtering
    // The notification part will be taken care of in the caller function
    return allCenters;
  } catch (e) {
    console.error("Error ocurred while searching for centres\n", e);
    return null;
  }
}
/**
 * This function performs additional sideffects related to schedule
 * collection modification
 * @param schedItem is an item in the schedule collection
 * @return centers
 */
export async function searchCentresWithPincode(
  schedItem: ISchedItem
): Promise<ICenter[] | null> {
  try {
    // We'll have to schedule a new item if it's still not "near" the ending date
    const startingFormattedDate = dayjs(schedItem.startingDate).format(
      "DD-MM-YYYY"
    );
    const allCenters: ICenter[] = [];
    if (!(Array.isArray(schedItem.pincodes) && schedItem.pincodes.length)) {
      await removeFromSchedule(schedItem);
      return null;
    }
    for await (const pincode of schedItem.pincodes) {
      const {
        data: { centers },
      } = await cowinAPI.get(
        `/v2/appointment/sessions/public/calendarByPin?date=${startingFormattedDate}&pincode=${pincode}`
      );
      if (!Array.isArray(centers)) continue;
      const formattedCenters: ICenter[] = centers.map((e: any) => {
        return {
          blockName: e.block_name,
          stateName: e.state_name,
          districtName: e.district_name,
          id: e.center_id,
          name: e.name,
          lat: e.lat,
          long: e.long,
          pincode: parseInt(e.pincode),
          paid: e.fee_type === "Free" ? false : true,
          sessions: e.sessions.map((session: any) => {
            return {
              capacity: session.available_capacity,
              minAgeLimit: session.min_age_limit,
              vaccineType: session.vaccine,
              date: dayjs(session.date, "DD-MM-YYYY").toDate(),
              sessionId: session.session_id,
            };
          }),
        };
      });
      allCenters.push(...formattedCenters);
    }
    if (allCenters.length === 0) {
      await scheduleNext(schedItem);
    }
    // Now check for the schedItems request permissions and send appropriate notifications
    allCenters.filter((center: any) => {
      let isAllowed = false;
      center.sessions.forEach((session: any) => {
        if (
          minAgeSatisfied(session, schedItem) &&
          paidAmountSatisfied(session, schedItem) &&
          vaccineTypeSatisfied(session, schedItem) &&
          numberOfSlotsGreaterThanSatisfied(session, schedItem)
        ) {
          isAllowed = true;
        }
      });
      return isAllowed;
    });
    // Now if there's still any centers left after filtering
    // The notification part will be taken care of in the caller function
    return allCenters;
  } catch (e) {
    console.error("Error ocurred while searching for centres by pincode\n", e);
    return null;
  }
}

function minAgeSatisfied(session: any, schedItem: ISchedItem): boolean {
  if (schedItem.minAge == null) {
    return true;
  }
  if (schedItem.minAge >= session.min_age_limit) {
    return true;
  }
  return false;
}

function vaccineTypeSatisfied(session: any, schedItem: ISchedItem): boolean {
  if (schedItem.vaccineType == null) return true;
  if (schedItem.vaccineType === session.vaccine) return true;
  return false;
}

function paidAmountSatisfied(session: any, schedItem: ISchedItem): boolean {
  if (schedItem.paid == null) return true;
  if (
    (session.fee_type === "Free" && !schedItem.paid) ||
    (session.fee_type !== "Free" && schedItem.paid)
  ) {
    return true;
  }
  return false;
}

function numberOfSlotsGreaterThanSatisfied(
  session: any,
  schedItem: ISchedItem
): boolean {
  if (schedItem.numberOfSlotsGreaterThan == null) {
    return true;
  }
  if (session.available_capacity >= schedItem.numberOfSlotsGreaterThan) {
    return true;
  }
  return false;
}
