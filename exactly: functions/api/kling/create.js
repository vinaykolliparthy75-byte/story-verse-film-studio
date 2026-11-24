
export async function onRequestPost({ request, env }) {
  try {
    if (!env.KLING_API_KEY) {
      return Response.json(
        { error: "Kling API key is not configured." },
        { status: 503 }
      );
    }

    const body = await request.json();
    const prompt = body.prompt;

    if (typeof prompt !== "string" || !prompt.trim()) {
      return Response.json(
        { error: "Please enter a video prompt." },
        { status: 400 }
      );
    }

    if (prompt.length > 3000) {
      return Response.json(
        { error: "Prompt is too long." },
        { status: 400 }
      );
    }

    const response = await fetch(
      "https://api-singapore.klingai.com/text-to-video/kling-4.0-flash",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.KLING_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          settings: {
            duration: 5,
            resolution: "720p",
            aspect_ratio: "9:16"
          }
        })
      }
    );

    const result = await response.json();

    return Response.json(result, {
      status: response.status
    });
  } catch (error) {
    return Response.json(
      { error: "Unable to create the Kling video task." },
      { status: 500 }
    );
  }
}
