export type LoginPayload = {
  username: string;
  password: string;
};

export type AccessTokenResponse = {
  accessToken: string;
};

export type User = {
  id: number;
  username: string;
  role: Role;
  dailyCalorieLimit: number;
  monthlyCostLimit: number;
};

export enum Role {
  Admin = "admin",
  User = "user",
}
