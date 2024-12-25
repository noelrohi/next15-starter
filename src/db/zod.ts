import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { post } from "./schema";

export const postSchema = createInsertSchema(post, {
  authorId: z.string().optional(),
});
