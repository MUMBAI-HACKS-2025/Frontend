/**
 * Deepgram Transcription Service
 * 
 * Handles audio transcription using Deepgram API
 */

const DEEPGRAM_API_KEY = (import.meta as any).env?.VITE_DEEPGRAM_API_KEY || ''

/**
 * Transcribe audio using Deepgram API
 * @param audioBlob - Audio blob to transcribe
 * @returns Transcribed text
 */
export async function transcribeWithDeepgram(audioBlob: Blob): Promise<string> {
  if (!DEEPGRAM_API_KEY) {
    console.warn('Deepgram API key not configured. Using mock transcription.')
    return 'Mock transcription: This is a placeholder transcription. Configure VITE_DEEPGRAM_API_KEY in your .env file to enable real transcription.'
  }

  try {
    const response = await fetch('https://api.deepgram.com/v1/listen', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${DEEPGRAM_API_KEY}`,
        'Content-Type': audioBlob.type || 'audio/webm',
      },
      body: audioBlob,
    })

    if (!response.ok) {
      throw new Error(`Deepgram API error: ${response.statusText}`)
    }

    const data = await response.json()
    const transcript = data.results?.channels?.[0]?.alternatives?.[0]?.transcript || ''
    
    if (!transcript) {
      throw new Error('No transcription returned from Deepgram')
    }

    return transcript
  } catch (error) {
    console.error('Transcription error:', error)
    throw new Error(`Transcription failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
