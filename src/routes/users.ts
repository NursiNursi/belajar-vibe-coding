import { Elysia, t } from "elysia";
import { db } from "../db";
import { users } from "../db/schema";

export const userRoutes = new Elysia({ prefix: "/users" })
  .get("/", async () => {
    try {
      const allUsers = await db.select().from(users);
      return { success: true, data: allUsers };
    } catch (error) {
      return { success: false, message: "Database connection or query failed", error: String(error) };
    }
  })
  .post(
    "/",
    async ({ body }) => {
      try {
        const result = await db.insert(users).values(body);
        return { success: true, message: "User created successfully", result };
      } catch (error) {
        return { success: false, message: "Failed to create user", error: String(error) };
      }
    },
    {
      body: t.Object({
        name: t.String(),
        email: t.String({ format: "email" }),
      }),
    }
  );
