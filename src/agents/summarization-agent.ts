import { createGpt54StreamingResponse } from "./core/openai-client";
import { buildSystemPromptWithMCP, MCPContext } from "./mcp-context-agent";

export async function runSummarization(transcript: string, context: MCPContext) {
  const baseSystemPrompt = `You are a professional Summarization Agent.
Analyze the provided transcript and generate:
1. A concise TL;DR.
2. The Key Points.
3. Action Items.
Format the output carefully.`;

  const systemPrompt = buildSystemPromptWithMCP(baseSystemPrompt, context);

  return createGpt54StreamingResponse(systemPrompt, transcript);
}
