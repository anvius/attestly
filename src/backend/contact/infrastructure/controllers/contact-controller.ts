import { Hono } from "hono";
import type { ContactRequestUseCase } from "../../application/contact-request.use-case";

type Dependencies = {
  contactRequestUseCase: ContactRequestUseCase;
  captchaFirstOperand: number;
  captchaSecondOperand: number;
};

export function buildContactController(dependencies: Dependencies): Hono {
  const router = new Hono();

  router.get("/contact/config", (c) => {
    return c.json({
      captcha: {
        firstOperand: dependencies.captchaFirstOperand,
        secondOperand: dependencies.captchaSecondOperand
      }
    });
  });

  router.post("/contact", async (c) => {
    const payload = await c.req.json();

    try {
      await dependencies.contactRequestUseCase.execute({
        name: String(payload?.name ?? ""),
        email: String(payload?.email ?? ""),
        message: String(payload?.message ?? ""),
        captchaAnswer: Number(payload?.captchaAnswer),
        honeypot: String(payload?.honeypot ?? "")
      });

      return c.json({ ok: true }, 200);
    } catch (error) {
      return c.json(
        { error: error instanceof Error ? error.message : "Contact request failed" },
        400
      );
    }
  });

  return router;
}
