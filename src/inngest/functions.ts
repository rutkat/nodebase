import prisma from "@/lib/db";
import { inngest } from "./client";
// import { createAnthropic } from '@ai-sdk/anthropic'; 
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from 'ai';
import * as Sentry from "@sentry/nextjs";

// const anthropic = createAnthropic();
// const model = anthropic('anthropic/claude-haiku-4.5');
const openai = createOpenAI();
const lmstudio = createOpenAICompatible({
  name: 'lmstudio',
  baseURL: 'http://127.0.0.1:1234/v1',
});
const model = lmstudio('zai-org/glm-4.6v-flash');

export const execute = inngest.createFunction(
  { id: "execute-ai" },
  { event: "execute/ai" },
  async ({ event, step }) => {
    // await step.sleep("pretend", "2s");
    Sentry.logger.info("User triggered test log");

    console.warn("Warn test in console.");

    const { steps: anthropicSteps } = await step.ai.wrap(
      "lmstudio-generate-text",
      generateText, 
      {
        model: model,
        system: "You are an assistant.",
        prompt: "Why is the sky blue? Answer in 2 sentences.",
        maxRetries: 1,
        experimental_telemetry: {
          isEnabled: true,
          recordInputs: true,
          recordOutputs: true,
        },
      }
    );
    const { steps: openaiSteps } = await step.ai.wrap(
      "openai-generate-text",
      generateText,
      {
        model: openai("gpt-4"),
        system: "You are a helpful assistant.",
        prompt: "What is 2 + 2?",
        experimental_telemetry: {
          isEnabled: true,
          recordInputs: true,
          recordOutputs: true,
        },
      }
    );
    return {
      openaiSteps,
      anthropicSteps,
    };
  },
);