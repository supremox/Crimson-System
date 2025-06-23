'use server';

import { revalidateTag } from "next/cache";

export const revalidateResponse = async (tag: string) => revalidateTag(tag)