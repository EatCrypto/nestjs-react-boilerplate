import axios from "axios";
import { useQuery } from "react-query";

export const useUserFoods = () => {
  return useQuery("foods", async () => {
    return axios.get("/food").then((res) => res.data);
  });
};
