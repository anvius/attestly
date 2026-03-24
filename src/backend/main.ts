import { createServerApp } from "./shared/http/server";

const app = createServerApp();

const port = Number(process.env.PORT ?? 3000);

console.log(JSON.stringify({ level: "info", msg: "backend_start", port, ts: new Date().toISOString() }));

export default {
  port,
  fetch: app.fetch
};
