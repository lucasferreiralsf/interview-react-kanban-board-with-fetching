import { Task } from "../models/task";

async function handleErrors(response: Response) {
  switch (response.status) {
    case 400:
      throw new Error(await response.text());

    default:
      throw new Error("Something went wrong, please try again!");
  }
}

async function getAllTasks(): Promise<Task[]> {
  const response = await fetch("/tasks", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  return response.json();
}

async function addNewTask(task: Task) {
  const response = await fetch("tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(task),
  });

  if (!response.ok) return handleErrors(response);
  return await response.json();
}

async function updateTaskStage(task: Task) {
  const response = await fetch(`/tasks/${task.name}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      stage: task.stage,
    }),
  });

  if (!response.ok) return handleErrors(response);
  return await response.json();
}

async function removeTask(name: string) {
  const response = await fetch(`/tasks/${name}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  if (!response.ok) return handleErrors(response);
}

export { getAllTasks, addNewTask, updateTaskStage, removeTask };
