import axios from "axios";
import { useQuery, useQueryClient, useMutation } from "react-query";
import {
  AverageEntriesAddedPerUser,
  EntriesPerReport,
  Food,
} from "../../models/food";

export const useUserFoodNameList = (userId: number) => {
  return useQuery(["food-list", userId], async () => {
    return axios
      .get<string[]>("/food/user/" + userId + "/list")
      .then((res) => res.data);
  });
};

export const useUserFoods = (
  userId: number,
  range: [moment.Moment | null, moment.Moment | null]
) => {
  const startDate = range[0]?.toISOString() ?? "";
  const endDate = range[1]?.toISOString() ?? "";

  const urlSearchParams = new URLSearchParams();
  if (startDate && endDate) {
    urlSearchParams.set("start", startDate);
    urlSearchParams.set("end", endDate);
  }

  return useQuery(
    ["foods", userId, startDate, endDate],
    async () => {
      return axios
        .get<Food[]>(`/food/user/${userId}?${urlSearchParams.toString()}`)
        .then((res) => res.data);
    },
    {}
  );
};

export const useAddNewFood = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (payload: Partial<Food> & { userId: number }) =>
      axios.post<Food>("/food", payload),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("foods");
        queryClient.invalidateQueries("food-list");
        queryClient.invalidateQueries("entries-per-week-report");
        queryClient.invalidateQueries("average-entries-per-user-report");
      },
    }
  );
};

export const useDeleteFood = () => {
  const queryClient = useQueryClient();
  return useMutation((id: number) => axios.delete("/food/" + id), {
    onSuccess: () => {
      queryClient.invalidateQueries("foods");
      queryClient.invalidateQueries("food-list");
      queryClient.invalidateQueries("entries-per-week-report");
      queryClient.invalidateQueries("average-entries-per-user-report");
    },
  });
};

export const useUpdateFood = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (payload: Food) => axios.patch<Food>("/food/" + payload.id, payload),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("foods");
        queryClient.invalidateQueries("food-list");
        queryClient.invalidateQueries("entries-per-week-report");
        queryClient.invalidateQueries("average-entries-per-user-report");
      },
    }
  );
};

export const useEntriesPerWeekReport = () => {
  return useQuery("entries-per-week-report", async () =>
    axios
      .get<EntriesPerReport>("/food/report/entries-per-week")
      .then((res) => res.data)
  );
};

export const useAverageEntriesPerUserReport = () => {
  return useQuery("average-entries-per-user-report", async () =>
    axios
      .get<AverageEntriesAddedPerUser>(
        "/food/report/average-entries-added-per-user"
      )
      .then((res) => res.data)
  );
};
