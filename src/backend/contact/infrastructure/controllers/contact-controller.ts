import { Hono } from "hono";
import { createHmac } from "node:crypto";
import type { ContactRequestUseCase } from "../../application/contact-request.use-case";

// La clave de firma se genera por proceso (cambia en cada reinicio)
// Para producción, leer de variable de entorno
const CAPTCHA_SECRET = process.env.CAPTCHA_SECRET ?? Math.random().toString(36).slice(2);

function randomOperand(): number {
  return 2 + Math.floor(Math.random() * 11);
}

function signCaptcha(sum: number, timestamp: number): string {
  return createHmac("sha256", CAPTCHA_SECRET)
    .update(`${sum}:${timestamp}`)
    .digest("hex")
    .slice(0, 12);
}

type Dependencies = {
  contactRequestUseCase: ContactRequestUseCase;
};

export function buildContactController(dependencies: Dependencies): Hono {
  const router = new Hono();

  // Devuelve operandos aleatorios + un token HMAC que el cliente reenvía en el POST
  router.get("/contact/config", (c) => {
    const a = randomOperand();
    const b = randomOperand();
    const sum = a + b;
    const ts = Date.now();
    const token = signCaptcha(sum, ts);

    return c.json({
      captcha: {
        firstOperand: a,
        secondOperand: b,
        token: `${ts}:${token}`
      }
    });
  });

  router.post("/contact", async (c) => {
    const payload = await c.req.json();

    try {
      // Validar el token HMAC del captcha
      const rawToken = String(payload?.captchaToken ?? "");
      const parts = rawToken.split(":");
      const ts = Number(parts[0]);
      const sig = parts[1] ?? "";
      const captchaAnswer = Number(payload?.captchaAnswer);

      const expectedSig = signCaptcha(captchaAnswer, ts);
      const isTokenValid = sig === expectedSig && Date.now() - ts < 30 * 60 * 1000; // 30 min

      if (!isTokenValid) {
        return c.json({ error: "Captcha inválido" }, 400);
      }

      await dependencies.contactRequestUseCase.execute({
        name: String(payload?.name ?? ""),
        email: String(payload?.email ?? ""),
        message: String(payload?.message ?? ""),
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
