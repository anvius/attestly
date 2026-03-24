import { Hono } from "hono";

const app = new Hono();

app.get("/health", (c) => {
  return c.json({ status: "ok", service: "doccum-backend" });
});

app.post("/api/certify", (c) => {
  return c.json({ message: "Not implemented yet" }, 501);
});

app.get("/api/cert/:id", (c) => {
  return c.json({ id: c.req.param("id"), message: "Not implemented yet" }, 501);
});

const port = Number(process.env.PORT ?? 3000);

console.log(JSON.stringify({ level: "info", msg: "backend_start", port, ts: new Date().toISOString() }));

export default {
  port,
  fetch: app.fetch
};
