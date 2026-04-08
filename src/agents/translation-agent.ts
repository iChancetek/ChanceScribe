import { createGpt54StreamingResponse } from "./core/openai-client";
import { buildSystemPromptWithMCP, MCPContext } from "./mcp-context-agent";

export async function runTranslation(
  transcript: string,
  targetLanguage: string,
  context: MCPContext
) {
  const baseSystemPrompt = `You are a professional context-aware Translation Agent. 
Translate the provided transcript into ${targetLanguage} accurately and contextually. 
Ensure idioms and nuances are preserved.`;

  const systemPrompt = buildSystemPromptWithMCP(baseSystemPrompt, context);

  return createGpt54StreamingResponse(systemPrompt, transcript);
}
