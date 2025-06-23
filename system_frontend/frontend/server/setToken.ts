'use server';

import { cookies } from "next/headers";

export const setToken = async (name: string, token: string) => {
    return (await cookies()).set(name, token, { httpOnly: true })
}