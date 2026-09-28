import { Elysia } from "elysia";
import { usersRoute } from "./routes/users-route";

const port = Number(process.env.PORT) || 3000;

const app = new Elysia()
  .get("/", () => ({ message: "Hello from ElysiaJS + Drizzle + MySQL Backend!" }))
  .get("/health", () => ({ status: "ok", timestamp: new Date().toISOString() }))
  // Mount routes dengan prefix /api sehingga endpoint menjadi /api/users
  .group("/api", (app) => app.use(usersRoute))
  .listen(port);

console.log(`🦊 Server Elysia berjalan pada http://${app.server?.hostname}:${app.server?.port}`);
