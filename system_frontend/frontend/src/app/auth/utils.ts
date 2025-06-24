// // import { cookies } from "next/headers";
// import axiosInstance from "../../../server/instance_axios"; 


// /**
//  * Removes both access and refresh tokens from cookies.
//  */

// // const removeToken = async (name: string) => {
// //     return (await cookies()).delete(name)
// // }


// // const login = (email: string, password: string) => {
// //   return axiosInstance.post("/api/token/", { email, password });
// // };

// const logout = () => {
//   return axiosInstance.post("/auth/logout/");
// };

// const handleJWTRefresh = () => {
//    return axiosInstance.post("/api/token/refresh/", {});
// }


// export const AuthActions = () => {
//     return {
//         login,
//         logout,
//         removeToken,
//         handleJWTRefresh,
//     };
// };

