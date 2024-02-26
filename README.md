# React: Kanban Board

## Environment

- React Version: ^18
- Node Version: ^18
- Default Port: 5173

## Functionality Requirements

- The board contains 4 stages of tasks in sequence - 'Backlog', 'To Do', 'Ongoing' and 'Done'.

- The 'New Task Name' input should initially be empty. The user can type a task name in this input box and clicking on the 'Create task' button should add a new task with this task name. This newly created task should be added to the Backlog stage (the first stage). Post this, then clear the input field.

- If the 'Create Task' button is clicked with the input being empty, nothing should happen.

- In every individual stage, the tasks are rendered as a list `<ul>` where each task is a single list item `<li>` which displays the name of the task.
- Each task list item has 3 icon buttons at the right -

  1. Back button - This must move the task to the previous stage in sequence, if any. This button is disabled if the task is in the first stage.
  2. Forward button - This must move the task to the next stage in sequence, if any. This button is disabled if the task is in the last stage.
  3. Delete button - This must remove the task from the board.

- Each task has 2 properties -
  1. name - the name of the task. This is the unique identification for every task. [STRING]
  2. stage - stage of task [NUMBER] (0 represents Backlog stage, 1 represents To Do stage, 2 represents Ongoing stage, 3 represents Done stage).

## Technical Specifications

- To solve this problem, you are only required to edit `src/components/kanban-board/index.tsx`.
  You are welcome to break up the code into smaller components or files if you feel that doing so
  increases the code quality.
- You must make network calls to perform the operations of creating, moving and deleting tasks.

Here are the REST operations that are required to be performed:

- `GET` `/tasks`; returns `200` with all tasks (`Task[]`)
- `POST` `/tasks`; returns `200` with the new task (`Task`), a `400` with a user-input-related error message, or a `500` with a server-related error message
- `DELETE` `/tasks/:name`; returns `200`, a `400` with a user-input-related error message, or a `500` with a server-related error message

> Note: The `POST` and `DELETE` routes will return a `500` status code 10% of the time to simulate server errors.
> You can force the server to return a `500` status code by passing a `error=true` query parameter.
> You can force the server to not error by passing a `error=false` query parameter.
> The `POST` and `DELETE` routes include a `400ms` delay to simulate network latency.
> Similarly, you can change the delay by passing a `delay={number}` query parameter.

The application should handle errors. It's up to you to decide how to handle them.

Use either `fetch`, `axios`, or `@tanstack/react-query` to perform these operations.

## Testing Requirements

- Input should have the `data-test-id` attribute `"create-task-input"`.
- The 'Create task' button should have the `data-test-id` attribute 'create-task-button'.
- `<ul>` for the 'Backlog' stage should have the `data-test-id` attribute `"stage-0"`.
- `<ul>` for the 'To Do' stage should have the `data-test-id` attribute `"stage-1"`.
- `<ul>` for the 'Ongoing' stage should have the `data-test-id` attribute `"stage-2"`.
- `<ul>` for the 'Done' stage should have the `data-test-id` attribute `"stage-3"`.
- Every single `<li>` task should have below:
  1. The `<span>` containing the name should have `data-test-id` attribute `"TASK_NAME-name"` where `TASK_NAME` is the name of the task joined by a hyphen symbol. For example, for the task named "task 0", it should be `"task-0-name"`. For the task named "abc", it should be `"abc-name"`.
  2. The back button should have `data-test-id` attribute `"TASK_NAME-back"` where `TASK_NAME` is the name of the task joined by a hyphen symbol. For example, for the task named "task 0", it should be `"task-0-back"`. For the task named "abc", it should be `"abc-back"`.
  3. The forward button should have `data-test-id` attribute `"TASK_NAME-forward"` where `TASK_NAME` is the name of the task joined by a hyphen symbol. For example, for the task named "task 0", it should be `"task-0-forward"`. For the task named "abc", it should be `"abc-forward"`.
  4. The delete button should have `data-test-id` attribute `"TASK_NAME-delete"` where `TASK_NAME` is the name of the task joined by a hyphen symbol. For example, for the task named "task 0", it should be `"task-0-delete"`. For the task named "abc", it should be `"abc-delete"`.

## Follow Up Questions

- How would you improve your implementation?
- Try resizing the page. What are some appropriate considerations when adopting the project a mobile app or mobile-friendly web app?
  How would you implement it?
