import axios from "axios";
import { useQuery, useQueryClient, useMutation } from "react-query";
import { Food } from "../../models/food";

export const useUserFoods = () => {
  return useQuery("foods", async () => {
    return axios.get<Food[]>("/food").then((res) => res.data);
  });
};

export const useAddNewFood = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (payload: Partial<Food>) => axios.post<Food>("/food", payload),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("foods");
      },
    }
  );
};
