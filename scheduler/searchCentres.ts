import { ISchedItem } from "./models/SchedItem";

interface ISession {
  capacity: number;
  date: string;
  minAgeLimit: number;
  sessionId: string;
  vaccineType: string;
}

export interface ICentre {
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

export default async function (
  schedItem: ISchedItem
): Promise<ICentre[] | void> {
  try {
  } catch (e) {
    console.error("Error ocurred while searching for centres\n", e);
  }
}
