import type { FastifyInstance } from "fastify";
import { DietPlanRequestSchema } from "../types";
import { generateDietPlan } from "../agent";

export async function planRoutes(app: FastifyInstance) {
  app.post("/plan", async (request, reply) => {
    reply.raw.setHeader("Access-Control-Allow-Origin", "*");
    reply.raw.setHeader("Content-Type", "text/plain; charset=utf-8");
    reply.raw.setHeader("Content-Type", "text/event-stream");
    reply.raw.setHeader("Cache-Control", "no-cache");
    reply.raw.setHeader("Connection", "keep-alive");

    const parsed = DietPlanRequestSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({
        error: "ValidationError",
        details: parsed.error.flatten((issue) => issue.message),
      });
    }

    try {
      for await (const delta of generateDietPlan(parsed.data)) {
        reply.raw.write(delta);
      }

      reply.raw.end();
    } catch (err: any) {
      request.log.error(err);
      reply.raw.write(`event: error\n ${JSON.stringify(err.message)}`);
      reply.raw.end();
    }

    return reply;
  });
}
