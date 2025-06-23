import wretch from "wretch";
import Cookies from "js-cookie";
import axiosInstance from "../../../server/instance_axios"; 

// Base API setup for making HTTP requests
const api = wretch("http://localhost:8000").accept("application/json");

/**
 * Stores a token in cookies.
 * @param {string} token - The token to be stored.
 * @param {"access" | "refresh"} type - The type of token (access or refresh).
 */

const storeToken = (token: string, type: "access" | "refresh") => {
    Cookies.set(type + "Token", token);
};

/**
 * Retrives a token from cookies.
 * @param {"access" | "refresh"} type - The type of the token to retrieve (access or refresh).
 * @returns {string | undefined} The token, if found
 */


const getToken = (type: string) => {
    return Cookies.get(type + "Token");
};

/**
 * Removes both access and refresh tokens from cookies.
 */

const removeTokens = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
};


const login = (email: string, password: string) => {
  return axiosInstance.post("/api/token/", { email, password });
};

const logout = () => {
  return axiosInstance.post("/auth/logout/");
};

const handleJWTRefresh = () => {
   return axiosInstance.post("/api/token/refresh/", {}, { withCredentials: true });
}


export const AuthActions = () => {
    return {
        login,
        logout,
        handleJWTRefresh,
    };
};

