import { describe, expect, it } from "bun:test";
import app from "../main";

describe("backend smoke", () => {
  it("responds health endpoint", async () => {
    const response = await app.fetch(new Request("http://localhost/health"));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.status).toBe("ok");
  });
});
