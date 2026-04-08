import { createGpt54StreamingResponse } from "./core/openai-client";
import { buildSystemPromptWithMCP, MCPContext } from "./mcp-context-agent";

/**
 * Speech-to-Text Agent
 * In a pure Realtime architecture (like WebSockets to OpenAI), audio chunks 
 * are streamed directly.
 * For this HTTP-based agent approach, we assume 'audioBase64' or a link is passed 
 * into the multimodal input layer of GPT-5.4.
 */
export async function runSST(
  audioInputData: string, // Could be base64 audio or a transcript fragment
  context: MCPContext
) {
  const baseSystemPrompt = `You are a real-time Speech-to-Text inference Agent.
Transcribe the provided input accurately.
Apply speaker separation and ignore background noise.`;

  const systemPrompt = buildSystemPromptWithMCP(baseSystemPrompt, context);

  // Note: For native GPT-5.4 multimodal, the user content might be a structured object
  // representing the audio, but we pass it directly to our GPT-5.4 wrapper. 
  return createGpt54StreamingResponse(systemPrompt, `[AUDIO_PAYLOAD]: ${audioInputData}`);
}
