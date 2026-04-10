import OpenAI from "openai";
import { wrapOpenAI } from "langsmith/wrappers";

const rawOpenai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env["OPENAI_API_KEY "] || "dummy_build_key",
});

export const openai = process.env.LANGSMITH_TRACING === "true" 
  ? wrapOpenAI(rawOpenai) 
  : rawOpenai;

export interface GPT54Input {
  role: "system" | "user" | "assistant";
  content: string;
}

/**
 * Creates a stream using the GPT-5.4 specified responses API.
 */
export async function createGpt54StreamingResponse(
  systemPrompt: string,
  userContent: string,
  model = "gpt-5.4"
) {
  return await openai.responses.create({
    model,
    input: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userContent },
    ],
    stream: true,
  });
}
