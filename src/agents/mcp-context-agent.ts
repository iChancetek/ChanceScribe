export interface MCPContext {
  sessionId?: string;
  userPreferences?: Record<string, string>;
  history?: object[];
  domainContext?: string; // e.g. "Medical", "Legal"
  customWords?: string[];
}

/**
 * Injects MCP Context into the base prompt.
 */
export function buildSystemPromptWithMCP(
  basePrompt: string,
  context: MCPContext
): string {
  let prompt = basePrompt + "\n\n--- MCP Context Injection ---\n";
  
  if (context.domainContext) {
    prompt += `Domain Mode: ${context.domainContext}\n`;
  }
  
  if (context.customWords && context.customWords.length > 0) {
    prompt += `Custom Dictionary - Always recognize the following terms: [${context.customWords.join(", ")}]\n`;
  }

  if (context.userPreferences) {
    prompt += `User Preferences: ${JSON.stringify(context.userPreferences)}\n`;
  }

  return prompt;
}
