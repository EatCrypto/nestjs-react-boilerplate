import { Moment } from "moment";

export type Food = {
  id: number;
  name: string;
  calorie: number;
  price: number;
  takenAt: string;
  threshold: number;
  cost: number;
};

export type NewFoodEntry = {
  name: string;
  calorie: number;
  price: number;
  takenAt: Moment;
};

export type EntriesPerReport = {
  lastWeekEntries: number;
  priorToLastWeekEntries: number;
};

export type AverageEntriesAddedPerUser = {
  [userId: number]: number;
};
