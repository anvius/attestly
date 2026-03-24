import { createApp } from "./shared/create-app";

const app = createApp();

const port = Number(process.env.PORT ?? 3000);

console.log(JSON.stringify({ level: "info", msg: "backend_start", port, ts: new Date().toISOString() }));

export default {
  port,
  fetch: app.fetch
};
