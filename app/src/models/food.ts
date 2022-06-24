import { Moment } from "moment";

export type Food = {
  id: number;
  name: string;
  calorie: number;
  price: number;
  takenAt: string;
};

export type NewFoodEntry = {
  name: string;
  calorie: number;
  price: number;
  takenAt: Moment;
};
