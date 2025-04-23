import { useReducer } from "react";
import { toast } from "react-toastify";
import {
  getUserFromLocalStorage,
  setExpirationDate,
} from "../helpers/checkExpiration";

interface User {
  id: number;
  name: string;
  email: string;
  expirationDate?: Date;
}

interface State {
  user: User | null;
  token: string | null;
}

const initialState: State = {
  user: getUserFromLocalStorage()?.user || null,
  token: getUserFromLocalStorage()?.token || null,
};

const baseUrl = process.env.REACT_APP_BASE_URL;

const actions = Object.freeze({
  SET_USER: "SET_USER" as const,
  LOGOUT: "LOGOUT" as const,
});

type Action =
  | { type: typeof actions.SET_USER; user: User; token: string; }
  | { type: typeof actions.LOGOUT; };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case actions.SET_USER:
      return { ...state, user: action.user, token: action.token };
    case actions.LOGOUT:
      return { ...state, user: null, token: null };
    default:
      return state;
  }
};

const useAuth = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const register = async (userInfo: { username: string; email: string; password: string; }) => {
    try {
      const response = await fetch(`${baseUrl}register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInfo),
      });

      const data = await response.json();
      if (data.error) {
        toast.error(data.error);
      } else if (data.user) {
        data.user.expirationDate = setExpirationDate(7);
        localStorage.setItem("user", JSON.stringify({ user: data.user, token: data.token }));
        dispatch({ type: actions.SET_USER, user: data.user, token: data.jwtToken });
        toast.success("Registration successful");
      }
    } catch (error) {
      toast.error("There was a problem registering, try again");
    }
  };


  const login = async (userInfo: { email: string; password: string; }) => {
    try {
      const response = await fetch(`${baseUrl}login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInfo),
      });

      const data = await response.json();
      if (data.error) {
        toast.error(data.error);
      } else if (data.user) {
        data.user.expirationDate = setExpirationDate(7);
        localStorage.setItem("user", JSON.stringify({ user: data.user, token: data.token }));
        dispatch({ type: actions.SET_USER, user: data.user, token: data.token });
        toast.success("Login successful");
      }
    } catch (error) {
      toast.error("There was a problem logging in, try again");
    }
  };

  const logout = async () => {
    localStorage.removeItem("user");
    dispatch({ type: actions.LOGOUT });
  };

  return { state, register, login, logout };
};

export default useAuth;
