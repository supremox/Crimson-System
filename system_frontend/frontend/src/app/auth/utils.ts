import wretch from "wretch";
import Cookies from "js-cookie";

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
    Cookies.remove("refereshToken");
};

const login = (email: string, password: string) => {
    return api.post({email: email, password}, "/api/token/");
};

const logout = () => {
    const refereshToken = getToken("refresh");
    return api.post({ refresh: refereshToken }, "/auth/logout/");
};

const handleJWTRefresh = () => {
    const refereshToken = getToken("refresh");
    return api.post({ refresh: refereshToken }, "api/token/refresh/")
}


export const AuthActions = () => {
    return {
        login,
        logout,
        storeToken,
        getToken,
        removeTokens,
        handleJWTRefresh,
    };
};

