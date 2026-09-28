import { Elysia, t } from "elysia";
import { UserService } from "../services/users-service";

export const usersRoute = new Elysia({ prefix: "/users" })
  .post(
    "/",
    async ({ body, set }) => {
      try {
        await UserService.register(body);
        set.status = 200;
        return { data: "OK" };
      } catch (error: any) {
        if (error.message === "Email sudah terdaftar") {
          set.status = 400;
          return { error: "Email sudah terdaftar" };
        }

        set.status = 500;
        return { error: error.message || "Terjadi kesalahan pada server" };
      }
    },
    {
      body: t.Object({
        name: t.String({ minLength: 1, error: "Nama wajib diisi" }),
        email: t.String({ format: "email", error: "Format email tidak valid" }),
        password: t.String({ minLength: 6, error: "Password minimal 6 karakter" }),
      }),
    }
  )
  .post(
    "/login",
    async ({ body, set }) => {
      try {
        const result = await UserService.login(body);
        set.status = 200;
        return { data: result.token };
      } catch (error: any) {
        if (error.message === "Email atau password salah") {
          set.status = 400;
          return { error: "Email atau password salah" };
        }

        set.status = 500;
        return { error: error.message || "Terjadi kesalahan pada server" };
      }
    },
    {
      body: t.Object({
        email: t.String({ format: "email", error: "Format email tidak valid" }),
        password: t.String({ minLength: 1, error: "Password wajib diisi" }),
      }),
    }
  );
