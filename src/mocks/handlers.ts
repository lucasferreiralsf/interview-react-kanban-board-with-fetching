import { http, HttpResponse } from "msw";
import { Task } from "../models/task";
import { db } from "./db";

// Configuration
function delay(ms: number) {
  return ms === undefined
    ? Promise.resolve()
    : new Promise((resolve) => setTimeout(resolve, ms));
}

// You can force an occasional 500 error by setting the `error` query parameter.
// Example: /tasks?error=true
// You can force a successful response by setting the `error` query parameter to `false`.
// Example: /tasks?error=false
// Otherwise, the server will randomly return a 500 error.
function getOcassional500Error(searchParams: URLSearchParams) {
  if (import.meta.env.NODE_ENV === "test") return false;
  const errorParam = searchParams.get("error");
  if (errorParam === "false") return;
  if (errorParam === "true" || Math.random() < 0.1) {
    return new HttpResponse("Internal Server Error", { status: 500 });
  }
}

function getErrorMessage(e: unknown): string {
  if (e instanceof Error) {
    return e.message;
  }
  if (typeof e === "string") {
    return e;
  }
  return "An unknown error occurred.";
}

function getDelayValue(searchParams: URLSearchParams): number | undefined {
  if (import.meta.env.NODE_ENV === "test") return 0;
  const delayParam = searchParams.get("delay");
  if (delayParam) {
    const parsed = parseInt(delayParam, 10);
    if (!isNaN(parsed)) {
      return parsed;
    }
  }
  return undefined;
}

export const handlers = [
  http.get("/tasks", async ({ request }) => {
    const { searchParams } = new URL(request.url);
    await delay(getDelayValue(searchParams) ?? 0);
    const tasks = db.task
      .getAll()
      .map((t) => ({ name: t.name, stage: t.stage }));

    return HttpResponse.json(tasks);
  }),
  http.post("/tasks", async ({ request }) => {
    const { searchParams } = new URL(request.url);
    await delay(getDelayValue(searchParams) ?? 0);
    const occasional500Error = getOcassional500Error(searchParams);
    if (occasional500Error) {
      return occasional500Error;
    }
    const body = (await request.json()) as unknown;
    if (!body) {
      return new HttpResponse("Missing body", { status: 400 });
    }
    if (
      !(body && typeof body === "object" && ("name" in body || "stage" in body))
    ) {
      return new HttpResponse("Missing either name or stage", { status: 400 });
    }
    const typedBody = body as Task;
    try {
      const task = db.task.create(typedBody);
      return HttpResponse.json(task);
    } catch (e) {
      const errorMessage = getErrorMessage(e);
      return new HttpResponse(errorMessage, { status: 400 });
    }
  }),
  http.put("/tasks/:name", async ({ params, request }) => {
    // Fake a delay to simulate a slow network
    const { searchParams } = new URL(request.url);
    await delay(getDelayValue(searchParams) ?? 400);
    const occasional500Error = getOcassional500Error(searchParams);
    if (occasional500Error) {
      return occasional500Error;
    }
    const { name } = params;
    const body = (await request.json()) as unknown;
    if (!body) {
      return new HttpResponse("Missing body", { status: 400 });
    }
    if (!name || typeof name !== "string") {
      return new HttpResponse("Missing name", { status: 400 });
    }
    if (!(body && typeof body === "object" && "stage" in body)) {
      return new HttpResponse("Missing stage in body", { status: 400 });
    }
    const typedBody = body as Task;
    try {
      const task = db.task.update({
        where: {
          name: {
            equals: name,
          },
        },
        data: {
          stage: typedBody.stage,
        },
      });
      return HttpResponse.json(task);
    } catch (e) {
      const errorMessage = getErrorMessage(e);
      return new HttpResponse(errorMessage, { status: 400 });
    }
  }),
  http.delete("/tasks/:name", async ({ params, request }) => {
    // Fake a delay to simulate a slow network
    const { searchParams } = new URL(request.url);
    await delay(getDelayValue(searchParams) ?? 400);
    const occasional500Error = getOcassional500Error(searchParams);
    if (occasional500Error) {
      return occasional500Error;
    }
    const { name } = params;
    if (!name || typeof name !== "string") {
      return new HttpResponse("Missing name", { status: 400 });
    }
    try {
      db.task.delete({
        where: {
          name: {
            equals: name,
          },
        },
      });
      return HttpResponse.text("OK", { status: 200 });
    } catch (e) {
      const errorMessage = getErrorMessage(e);
      return new HttpResponse(errorMessage, { status: 400 });
    }
  }),
];
