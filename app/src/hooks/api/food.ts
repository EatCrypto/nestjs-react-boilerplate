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

export const useAdminAddNewFood = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (
      payload: Pick<Food, "name" | "calorie" | "price" | "takenAt"> & {
        userId: number;
      }
    ) => axios.post<Food>("/food/admin", payload),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("users");
      },
    }
  );
};

export const useDeleteFood = () => {
  const queryClient = useQueryClient();
  return useMutation((id: number) => axios.delete("/food/" + id), {
    onSuccess: () => queryClient.invalidateQueries("users"),
  });
};

export const useUpdateFood = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (payload: Food) => axios.patch<Food>("/food/" + payload.id, payload),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("users");
      },
    }
  );
};
