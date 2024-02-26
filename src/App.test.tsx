import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";
import App from "./App";

const renderApp = () => render(<App />);

afterEach(() => {
  cleanup();
});

// elements in App by data-testids
const testIds = {
  createTaskInput: "create-task-input",
  createTaskButton: "create-task-button",
  moveBackButton: "move-back-button",
  moveForwardButton: "move-forward-button",
  deleteButton: "delete-button",
  stages: ["stage-0", "stage-1", "stage-2", "stage-3"],
} as const;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

test("Clicking on Create Task Button should add it to first stage and do nothing if input is empty", async () => {
  const { getByTestId, queryByTestId } = renderApp();

  const createTaskInput = getByTestId(testIds.createTaskInput);
  const createTaskButton = getByTestId(testIds.createTaskButton);
  const backlogStage = getByTestId(testIds.stages[0]);
  const toDoStage = getByTestId(testIds.stages[1]);

  const taskName = "task 1";
  const taskId = `${taskName.split(" ").join("-")}-name`;
  fireEvent.change(createTaskInput, {
    target: { value: taskName },
  });

  expect(backlogStage).not.toContainElement(queryByTestId(taskId));
  expect(toDoStage).not.toContainElement(queryByTestId(taskId));
  fireEvent.click(createTaskButton);
  await delay(20);

  expect(backlogStage).toContainElement(queryByTestId(taskId));
  expect(toDoStage).not.toContainElement(queryByTestId(taskId));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expect((createTaskInput as any).value).toBeFalsy();

  const initialLength = backlogStage.children.length;
  fireEvent.change(createTaskInput, {
    target: { value: "" },
  });
  fireEvent.click(createTaskButton);
  await delay(20);

  expect(backlogStage.children.length).toBe(initialLength);
});

test("For a task in stage 0, backward icon is disabled and forward icon is enabled", async () => {
  const { getByTestId, queryByTestId } = renderApp();

  const createTaskInput = getByTestId(testIds.createTaskInput);
  const createTaskButton = getByTestId(testIds.createTaskButton);
  const backlogStage = getByTestId(testIds.stages[0]);

  const taskName = "task 1";
  const taskId = `${taskName.split(" ").join("-")}-name`;
  const taskBackIconId = `${taskName.split(" ").join("-")}-back`;
  const taskForwardIconId = `${taskName.split(" ").join("-")}-forward`;

  fireEvent.change(createTaskInput, {
    target: { value: taskName },
  });

  fireEvent.click(createTaskButton);
  await delay(20);

  expect(backlogStage).toContainElement(queryByTestId(taskId));
  expect(getByTestId(taskBackIconId).hasAttribute("disabled")).toBe(true);
  expect(getByTestId(taskForwardIconId).hasAttribute("disabled")).toBeFalsy();
});

test("For a task in stage 0, can be moved forward till stage 4 and check for icons are enabled/disabled correctly", async () => {
  const { getByTestId, queryByTestId } = renderApp();

  const createTaskInput = getByTestId(testIds.createTaskInput);
  const createTaskButton = getByTestId(testIds.createTaskButton);
  const backlogStage = getByTestId(testIds.stages[0]);
  const toDoStage = getByTestId(testIds.stages[1]);
  const onGoingStage = getByTestId(testIds.stages[2]);
  const doneStage = getByTestId(testIds.stages[3]);

  const taskName = "task 1";
  const taskId = `${taskName.split(" ").join("-")}-name`;
  const taskBackIconId = `${taskName.split(" ").join("-")}-back`;
  const taskForwardIconId = `${taskName.split(" ").join("-")}-forward`;

  expect(backlogStage).not.toContainElement(queryByTestId(taskId));
  expect(toDoStage).not.toContainElement(queryByTestId(taskId));
  expect(onGoingStage).not.toContainElement(queryByTestId(taskId));
  expect(doneStage).not.toContainElement(queryByTestId(taskId));

  fireEvent.change(createTaskInput, {
    target: { value: taskName },
  });

  fireEvent.click(createTaskButton);
  await delay(20);

  expect(backlogStage).toContainElement(queryByTestId(taskId));
  expect(toDoStage).not.toContainElement(queryByTestId(taskId));
  expect(onGoingStage).not.toContainElement(queryByTestId(taskId));
  expect(doneStage).not.toContainElement(queryByTestId(taskId));

  fireEvent.click(getByTestId(taskForwardIconId));

  await delay(20);

  expect(backlogStage).not.toContainElement(queryByTestId(taskId));
  expect(toDoStage).toContainElement(queryByTestId(taskId));
  expect(onGoingStage).not.toContainElement(queryByTestId(taskId));
  expect(doneStage).not.toContainElement(queryByTestId(taskId));
  expect(getByTestId(taskBackIconId).hasAttribute("disabled")).toBeFalsy();
  expect(getByTestId(taskForwardIconId).hasAttribute("disabled")).toBeFalsy();

  fireEvent.click(getByTestId(taskForwardIconId));
  await delay(20);

  expect(backlogStage).not.toContainElement(queryByTestId(taskId));
  expect(toDoStage).not.toContainElement(queryByTestId(taskId));
  expect(onGoingStage).toContainElement(queryByTestId(taskId));
  expect(doneStage).not.toContainElement(queryByTestId(taskId));
  expect(getByTestId(taskBackIconId).hasAttribute("disabled")).toBeFalsy();
  expect(getByTestId(taskForwardIconId).hasAttribute("disabled")).toBeFalsy();

  fireEvent.click(getByTestId(taskForwardIconId));
  await delay(20);

  expect(backlogStage).not.toContainElement(queryByTestId(taskId));
  expect(toDoStage).not.toContainElement(queryByTestId(taskId));
  expect(onGoingStage).not.toContainElement(queryByTestId(taskId));
  expect(doneStage).toContainElement(queryByTestId(taskId));

  expect(getByTestId(taskBackIconId).hasAttribute("disabled")).toBeFalsy();
  expect(getByTestId(taskForwardIconId).hasAttribute("disabled")).toBe(true);
});

test("For a task in stage 4, can be moved backward till stage 0 and check for icons are enabled/disabled correctly", async () => {
  const { getByTestId, queryByTestId } = renderApp();

  const createTaskInput = getByTestId(testIds.createTaskInput);
  const createTaskButton = getByTestId(testIds.createTaskButton);
  const backlogStage = getByTestId(testIds.stages[0]);
  const toDoStage = getByTestId(testIds.stages[1]);
  const onGoingStage = getByTestId(testIds.stages[2]);
  const doneStage = getByTestId(testIds.stages[3]);

  const taskName = "task 1";
  const taskId = `${taskName.split(" ").join("-")}-name`;
  const taskBackIconId = `${taskName.split(" ").join("-")}-back`;
  const taskForwardIconId = `${taskName.split(" ").join("-")}-forward`;

  fireEvent.change(createTaskInput, {
    target: { value: taskName },
  });

  fireEvent.click(createTaskButton);
  await delay(20);
  fireEvent.click(getByTestId(taskForwardIconId));
  await delay(20);
  fireEvent.click(getByTestId(taskForwardIconId));
  await delay(20);
  fireEvent.click(getByTestId(taskForwardIconId));
  await delay(20);

  fireEvent.click(getByTestId(taskBackIconId));
  await delay(20);
  expect(backlogStage).not.toContainElement(queryByTestId(taskId));
  expect(toDoStage).not.toContainElement(queryByTestId(taskId));
  expect(onGoingStage).toContainElement(queryByTestId(taskId));
  expect(doneStage).not.toContainElement(queryByTestId(taskId));
  expect(getByTestId(taskBackIconId).hasAttribute("disabled")).toBeFalsy();
  expect(getByTestId(taskForwardIconId).hasAttribute("disabled")).toBeFalsy();

  fireEvent.click(getByTestId(taskBackIconId));
  await delay(20);
  expect(backlogStage).not.toContainElement(queryByTestId(taskId));
  expect(toDoStage).toContainElement(queryByTestId(taskId));
  expect(onGoingStage).not.toContainElement(queryByTestId(taskId));
  expect(doneStage).not.toContainElement(queryByTestId(taskId));
  expect(getByTestId(taskBackIconId).hasAttribute("disabled")).toBeFalsy();
  expect(getByTestId(taskForwardIconId).hasAttribute("disabled")).toBeFalsy();

  fireEvent.click(getByTestId(taskBackIconId));
  await delay(20);
  expect(backlogStage).toContainElement(queryByTestId(taskId));
  expect(toDoStage).not.toContainElement(queryByTestId(taskId));
  expect(onGoingStage).not.toContainElement(queryByTestId(taskId));
  expect(doneStage).not.toContainElement(queryByTestId(taskId));
  expect(getByTestId(taskBackIconId).hasAttribute("disabled")).toBe(true);
  expect(getByTestId(taskForwardIconId).hasAttribute("disabled")).toBeFalsy();
});

test("Clicking on delete should delete the task in stage 0", async () => {
  const { getByTestId, queryByTestId } = renderApp();

  const createTaskInput = getByTestId(testIds.createTaskInput);
  const createTaskButton = getByTestId(testIds.createTaskButton);
  const backlogStage = getByTestId(testIds.stages[0]);

  const taskName = "task 1";
  const taskId = `${taskName.split(" ").join("-")}-name`;
  const taskDeleteIconId = `${taskName.split(" ").join("-")}-delete`;

  fireEvent.change(createTaskInput, {
    target: { value: taskName },
  });

  fireEvent.click(createTaskButton);
  await delay(20);

  expect(backlogStage).toContainElement(queryByTestId(taskId));
  expect(getByTestId(taskDeleteIconId).hasAttribute("disabled")).toBe(false);
  fireEvent.click(getByTestId(taskDeleteIconId));
  await delay(20);
  expect(backlogStage).not.toContainElement(queryByTestId(taskId));
});

test("Clicking on delete should delete the task in stage 1", async () => {
  const { getByTestId, queryByTestId } = renderApp();

  const createTaskInput = getByTestId(testIds.createTaskInput);
  const createTaskButton = getByTestId(testIds.createTaskButton);
  const toDoStage = getByTestId(testIds.stages[1]);

  const taskName = "task 1";
  const taskId = `${taskName.split(" ").join("-")}-name`;
  const taskDeleteIconId = `${taskName.split(" ").join("-")}-delete`;
  const taskForwardIconId = `${taskName.split(" ").join("-")}-forward`;

  fireEvent.change(createTaskInput, {
    target: { value: taskName },
  });

  fireEvent.click(createTaskButton);
  await delay(20);
  fireEvent.click(getByTestId(taskForwardIconId));
  await delay(20);

  expect(toDoStage).toContainElement(queryByTestId(taskId));
  expect(getByTestId(taskDeleteIconId).hasAttribute("disabled")).toBe(false);
  fireEvent.click(getByTestId(taskDeleteIconId));
  await delay(20);
  expect(toDoStage).not.toContainElement(queryByTestId(taskId));
});

test("Clicking on delete should delete the task in stage 2", async () => {
  const { getByTestId, queryByTestId } = renderApp();

  const createTaskInput = getByTestId(testIds.createTaskInput);
  const createTaskButton = getByTestId(testIds.createTaskButton);
  const activeStage = getByTestId(testIds.stages[2]);

  const taskName = "task 1";
  const taskId = `${taskName.split(" ").join("-")}-name`;
  const taskDeleteIconId = `${taskName.split(" ").join("-")}-delete`;
  const taskForwardIconId = `${taskName.split(" ").join("-")}-forward`;

  fireEvent.change(createTaskInput, {
    target: { value: taskName },
  });

  fireEvent.click(createTaskButton);
  await delay(20);
  fireEvent.click(getByTestId(taskForwardIconId));
  await delay(20);
  fireEvent.click(getByTestId(taskForwardIconId));
  await delay(20);

  expect(activeStage).toContainElement(queryByTestId(taskId));
  expect(getByTestId(taskDeleteIconId).hasAttribute("disabled")).toBe(false);
  fireEvent.click(getByTestId(taskDeleteIconId));
  await delay(20);
  expect(activeStage).not.toContainElement(queryByTestId(taskId));
});

test("Clicking on delete should delete the task in stage 3", async () => {
  const { getByTestId, queryByTestId } = renderApp();

  const createTaskInput = getByTestId(testIds.createTaskInput);
  const createTaskButton = getByTestId(testIds.createTaskButton);
  const doneStage = getByTestId(testIds.stages[3]);

  const taskName = "task 1";
  const taskId = `${taskName.split(" ").join("-")}-name`;
  const taskDeleteIconId = `${taskName.split(" ").join("-")}-delete`;
  const taskForwardIconId = `${taskName.split(" ").join("-")}-forward`;

  fireEvent.change(createTaskInput, {
    target: { value: taskName },
  });

  fireEvent.click(createTaskButton);
  await delay(20);
  fireEvent.click(getByTestId(taskForwardIconId));
  await delay(20);
  fireEvent.click(getByTestId(taskForwardIconId));
  await delay(20);
  fireEvent.click(getByTestId(taskForwardIconId));
  await delay(20);

  expect(doneStage).toContainElement(queryByTestId(taskId));
  expect(getByTestId(taskDeleteIconId).hasAttribute("disabled")).toBe(false);
  fireEvent.click(getByTestId(taskDeleteIconId));
  await delay(20);
  expect(doneStage).not.toContainElement(queryByTestId(taskId));
});
