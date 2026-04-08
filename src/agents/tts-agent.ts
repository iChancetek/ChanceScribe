import { openai } from "./core/openai-client";

export async function runTTS(text: string, languageVoice: "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer" = "alloy") {
  // Using standard OpenAI TTS endpoints which provide Natural voice synthesis
  const mp3 = await openai.audio.speech.create({
    model: "tts-1",
    voice: languageVoice,
    input: text,
  });

  return mp3; // Returns the Response object wrapping the streaming binary blob
}
