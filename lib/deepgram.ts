// Deepgram transcription utility
// Usage: await transcribeWithDeepgram(audioBlob)

const DEEPGRAM_API_KEY = "ca1f70d17e106139d92deba1df30a3cd8e8bf82e";

export async function transcribeWithDeepgram(audioBlob: Blob): Promise<string> {
  const url = "https://api.deepgram.com/v1/listen";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Token ${DEEPGRAM_API_KEY}`,
      "Content-Type": audioBlob.type || "audio/wav",
    },
    body: audioBlob,
  });
  if (!response.ok) {
    throw new Error(`Deepgram API error: ${response.statusText}`);
  }
  const data = await response.json();
  return data.results?.channels?.[0]?.alternatives?.[0]?.transcript || "";
}
