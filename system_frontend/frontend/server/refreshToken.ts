import axios from "axios";
import { getRefresh } from "./getToken";
import { setToken } from "./setToken";

export async function refreshToken() {
  const refresh = await getRefresh();
  const response = await axios.post("http://localhost:8000/api/token/refresh/", {
    refresh,
  });
  const { access } = response.data;
  await setToken("accessToken", access);
  return access;
}