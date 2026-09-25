import { Elysia } from "elysia";
import { userRoutes } from "./routes/users";

const port = Number(process.env.PORT) || 3000;

const app = new Elysia()
  .get("/", () => ({ message: "Hello from ElysiaJS + Drizzle + MySQL Backend!" }))
  .get("/health", () => ({ status: "ok", timestamp: new Date().toISOString() }))
  .use(userRoutes)
  .listen(port);

console.log(`🦊 Server Elysia berjalan pada ${app.server?.hostname}:${app.server?.port}`);
