"use server";
import { auth } from "@/auth/auth.index";
import { db } from "@/db";
import { type InsertPost, post } from "@/db/schema";
import type { postSchema } from "@/db/zod";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import type { z } from "zod";

type CreatePostData = z.infer<typeof postSchema>;

export async function createPost(data: CreatePostData) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user?.id) {
      return {
        success: false,
        error: "User not authenticated",
      };
    }

    const toInsert: InsertPost = {
      ...data,
      authorId: session.user.id,
    };
    const [result] = await db.insert(post).values(toInsert).returning();
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: error,
    };
  } finally {
    revalidatePath("/");
  }
}
