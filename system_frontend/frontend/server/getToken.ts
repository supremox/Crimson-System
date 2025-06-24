'use server';

import { cookies } from "next/headers";

export const getToken = async () => {
    return (await cookies()).get('accessToken')?.value;
}

export const getRefresh = async () => {
    return (await cookies()).get('refreshToken')?.value;
}


export const removeToken = async (name: string) => {
    return (await cookies()).delete(name)
}
