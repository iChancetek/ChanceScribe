"use server";

import { openai } from "@/agents/core/openai-client";

export async function transcribeAudio(formData: FormData): Promise<string> {
  const audioFile = formData.get("audio") as File;
  
  if (!audioFile) {
    throw new Error("No audio payload found.");
  }

  try {
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
    });
    
    return transcription.text;
  } catch (error: any) {
    console.error("Whisper Transcription Error:", error);
    throw new Error("Failed to transcribe via Whisper.");
  }
}
