import axios from "axios";
import {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useCookies } from "react-cookie";
import { useUserInfo, useUserLogin } from "../hooks/api/user";
import { LoginPayload, User } from "../models/user";

type AuthContextState = {
  onLogin: (payload: LoginPayload) => void;
  loggingIn: boolean;
  onLogout: () => void;
  accessToken: string;
  authUser?: User;
};

const AuthContext = createContext<AuthContextState>({
  onLogin: () => {},
  loggingIn: false,
  onLogout: () => {},
  accessToken: "",
});

const AUTH_COOKIE_NAME = "toptal.calorie.app.user";

export const AuthContextProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cookies, setCookie, removeCookie] = useCookies([AUTH_COOKIE_NAME]);
  const userLoginMutation = useUserLogin();
  const [accessToken, setAccessToken] = useState<string>(
    cookies[AUTH_COOKIE_NAME]
  );
  const {
    isLoading: isLoadingUserInfo,
    data: authUser,
    isError,
  } = useUserInfo(accessToken);

  console.log(authUser);

  const onLogin = useCallback(
    (payload: LoginPayload) => {
      userLoginMutation.mutate(payload, {
        onSuccess: ({ data: { accessToken } }) => {
          setAccessToken(accessToken);
          setCookie(AUTH_COOKIE_NAME, accessToken);
        },
      });
    },
    [setCookie, userLoginMutation]
  );

  const onLogout = useCallback(() => {
    removeCookie(AUTH_COOKIE_NAME);
    setAccessToken("");
    axios.defaults.headers.common["Authorization"] = "";
  }, [removeCookie]);

  useEffect(() => {
    if (accessToken) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    }
  }, [accessToken]);

  useEffect(() => {
    if (isError) {
      onLogout();
    }
  }, [isError, onLogout]);

  return (
    <AuthContext.Provider
      value={{
        onLogin,
        onLogout,
        loggingIn: userLoginMutation.isLoading || isLoadingUserInfo,
        accessToken,
        authUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const authContext = useContext(AuthContext);
  return authContext;
};
