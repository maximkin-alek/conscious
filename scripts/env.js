const { z } = require("zod");

const aiReviewEnvSchema = z
  .object({
    // Optional: если не задан — AI-ревью пропускается (push не блокируется)
    OPENAI_API_KEY: z.string().trim().optional(),

    // Optional
    OPENAI_MODEL: z.string().trim().default("gpt-4o-mini"),
    OPENAI_BASE_URL: z
      .string()
      .trim()
      .url()
      .default("https://api.openai.com/v1")
      .transform((v) => v.replace(/\/$/, "")),

    // Optional limits (числа, но в env приходят строками)
    AI_REVIEW_MAX_FILES: z.coerce.number().int().min(1).max(100).default(12),
    AI_REVIEW_MAX_FILE_CHARS: z.coerce
      .number()
      .int()
      .min(1000)
      .max(500000)
      .default(40000),
    AI_REVIEW_MAX_DIFF_CHARS: z.coerce
      .number()
      .int()
      .min(1000)
      .max(2000000)
      .default(120000),
  })
  .passthrough();

function getAiReviewEnv(rawEnv = process.env) {
  // Важно: schema ожидает строки/undefined, как в real env
  return aiReviewEnvSchema.parse(rawEnv);
}

module.exports = { getAiReviewEnv };
