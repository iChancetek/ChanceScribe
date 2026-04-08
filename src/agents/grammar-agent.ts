import { createGpt54StreamingResponse } from "./core/openai-client";
import { buildSystemPromptWithMCP, MCPContext } from "./mcp-context-agent";

export async function runGrammarEnhancement(transcript: string, context: MCPContext) {
  const baseSystemPrompt = `You are a Grammar + Enhancement Agent.
Your tasks:
1. Correct any structural or grammatical issues in the transcript.
2. Transform the tone if specified in the user preferences.
3. Optimize for clarity and readability without losing the original meaning.`;

  const systemPrompt = buildSystemPromptWithMCP(baseSystemPrompt, context);

  return createGpt54StreamingResponse(systemPrompt, transcript);
}
