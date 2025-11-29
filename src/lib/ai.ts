export interface AIRequest {
  prompt: string;
  model?: string;
  temperature?: number;
  max_tokens?: number;
  response_format?: "text" | "json" | "markdown";
}

export interface AIResponse {
  content: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export async function askAI(request: AIRequest): Promise<AIResponse> {
  try {
    const response = await fetch("http://localhost:8000/api/v1/openai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        ...request,
      }),
    });

    if (!response.ok) {
      throw new Error(`AI request failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.success && data.result) {
        return { content: data.result };
    }
    
    return { content: "Error: AI request was not successful." };

  } catch (error) {
    console.error("Error calling AI endpoint:", error);
    return { content: "Error: Could not fetch AI insights." };
  }
}
