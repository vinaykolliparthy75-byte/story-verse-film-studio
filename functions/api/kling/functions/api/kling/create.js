
export async function onRequestPost({ request, env }) {
  try {
    if (!env.KLING_API_KEY) {
      return Response.json(
        { error: "Kling API key is not configured." },
        { status: 503 }
      );
    }

    const body = await request.json();
    const prompt = String(body.prompt || "").trim();
    const duration = Number(body.duration || 10);
    const aspect_ratio = body.aspect_ratio || "16:9";

    if (!prompt) {
      return Response.json(
        { error: "A video prompt is required." },
        { status: 400 }
      );
    }

    if (!Number.isInteger(duration) || duration < 3 || duration > 20) {
      return Response.json(
        { error: "Duration must be between 3 and 20 seconds." },
        { status: 400 }
      );
    }

    if (!["16:9", "9:16", "1:1"].includes(aspect_ratio)) {
      return Response.json(
        { error: "Unsupported aspect ratio." },
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
          prompt,
          settings: {
            duration,
            resolution: "720p",
            aspect_ratio
          }
        })
      }
    );

    const result = await response.json();

    return Response.json(result, {
      status: response.ok ? 200 : response.status
    });

  } catch (error) {
    return Response.json(
      { error: "Video request failed. Please check the server logs." },
      { status: 500 }
    );
  }
  }
