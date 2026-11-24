
export async function onRequestGet({ request, env }) {
  try {
    if (!env.KLING_API_KEY) {
      return Response.json(
        { error: "Kling API key is not configured." },
        { status: 503 }
      );
    }

    const url = new URL(request.url);
    const taskId = url.searchParams.get("task_id");

    if (!taskId || !/^[0-9]+$/.test(taskId)) {
      return Response.json(
        { error: "A valid Kling task_id is required." },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://api-singapore.klingai.com/tasks?task_ids=${encodeURIComponent(taskId)}`,
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${env.KLING_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const result = await response.json();

    return Response.json(result, {
      status: response.status
    });
  } catch (error) {
    return Response.json(
      { error: "Unable to check the Kling task status." },
      { status: 500 }
    );
  }
}
