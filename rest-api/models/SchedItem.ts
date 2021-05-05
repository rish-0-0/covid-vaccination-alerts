import { model, Schema, Document } from "mongoose";

export interface ISchedItem extends Document {
  pincodes?: Array<string>;
  startingDate?: Date;
  endingDate?: Date;
  numberOfSlotsGreaterThan?: number;
  vaccineType?: string;
  paid?: boolean;
  minAge?: number;
  districtId?: number;
  repeatEvery: number; // In Hours
  userSubscription?: string;
  email?: string;
}

const SchedItemSchema: Schema = new Schema({
  pincodes: [String],
  startingDate: Date,
  endingDate: Date,
  numberOfSlotsGreaterThan: Number,
  vaccineType: String,
  paid: Boolean,
  minAge: Number,
  districtId: Number,
  repeatEvery: Number,
  userSubscription: String,
  email: String,
});

export default model<ISchedItem>("SchedItem", SchedItemSchema);
