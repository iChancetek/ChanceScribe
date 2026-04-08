export interface PrivacyConfig {
  privacyModeEnabled: boolean; // Zero Data Retention (ZDR)
  hipaaCompliant: boolean;
}

export function shouldStoreInFirestore(config: PrivacyConfig): boolean {
  if (config.privacyModeEnabled) {
    // Zero Data Retention explicitly prohibits logging prompts and transcripts
    return false;
  }
  return true;
}

/**
 * Example agent hook to sanitize context before sending to OpenAI
 */
export function sanitizeForOpenAI(content: string, config: PrivacyConfig): string {
  if (config.hipaaCompliant) {
    // In a real scenario, run local PII redaction here.
    return content;
  }
  return content;
}
