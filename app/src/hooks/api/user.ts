import axios, { AxiosResponse } from "axios";
import { useMutation, useQuery } from "react-query";
import { AccessTokenResponse, LoginPayload, User } from "../../models/user";

export const useUserLogin = () => {
  const mutation = useMutation((payload: LoginPayload) => {
    return axios.post<LoginPayload, AxiosResponse<AccessTokenResponse>>(
      "/user/login",
      payload
    );
  });

  return mutation;
};

export const useUserInfo = (token: string) => {
  return useQuery(
    "me",
    async () => {
      return axios
        .get<{}, AxiosResponse<User>>("/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => res.data);
    },
    {
      enabled: !!token,
    }
  );
};

export const useAllUsers = () => {
  return useQuery("users", async () =>
    axios.get<User[]>("/user").then((res) => res.data)
  );
};
