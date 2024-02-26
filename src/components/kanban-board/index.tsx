import { useState } from "react";
import { Task } from "../../models/task";
import "./index.css";

const stagesNames = ["Backlog", "To Do", "In Progress", "Done"] as const;

export default function KanbanBoard() {
  // Each task is uniquely identified by its name.
  // Therefore, when you perform any operation on tasks,
  // make sure you pick tasks by names (primary key)
  // instead of any kind of index or any other attribute.

  // Convert this to fetching from `GET /tasks` endpoint
  const [tasks, setTasks] = useState<Task[]>([]);

  // Routes:
  // `GET`   `/tasks`; returns `200` with all tasks (`Task[]`)
  // `POST`  `/tasks`; returns `200` with the new task (`Task`), a `400` with a user-input-related error message,
  //          or a `500` with a server-related error message
  // `DELETE` `/tasks/:name`; returns `200`, a `400` with a user-input-related error message,
  //          or a `500` with a server-related error message

  const stagesTasks: Task[][] = [];
  for (let i = 0; i < stagesNames.length; ++i) {
    stagesTasks.push([]);
  }
  for (const task of tasks) {
    const stageId = task.stage;
    stagesTasks[stageId].push(task);
  }

  return (
    <div className="mt-20 layout-column justify-content-center align-items-center">
      <section className="mt-50 layout-row align-items-center justify-content-center">
        <input
          id="create-task-input"
          type="text"
          className="large"
          placeholder="New task name"
          data-testid="create-task-input"
        />
        <button
          type="submit"
          className="ml-30"
          data-testid="create-task-button"
        >
          Create task
        </button>
      </section>

      <div className="mt-50 layout-row">
        {stagesTasks.map((tasks, i) => {
          return (
            <div className="card outlined ml-20 mt-0" key={`${i}`}>
              <div className="card-text">
                <h4>{stagesNames[i]}</h4>
                <ul className="styled mt-50" data-testid={`stage-${i}`}>
                  {tasks.map((task, index) => {
                    return (
                      <li className="slide-up-fade-in" key={`${i}${index}`}>
                        <div className="li-content layout-row justify-content-between align-items-center">
                          <span
                            data-testid={`${task.name
                              .split(" ")
                              .join("-")}-name`}
                          >
                            {task.name}
                          </span>
                          <div className="icons">
                            <button
                              className="icon-only x-small mx-2"
                              data-testid={`${task.name
                                .split(" ")
                                .join("-")}-back`}
                            >
                              <i className="material-icons">arrow_back</i>
                            </button>
                            <button
                              className="icon-only x-small mx-2"
                              data-testid={`${task.name
                                .split(" ")
                                .join("-")}-forward`}
                            >
                              <i className="material-icons">arrow_forward</i>
                            </button>
                            <button
                              className="icon-only danger x-small mx-2"
                              data-testid={`${task.name
                                .split(" ")
                                .join("-")}-delete`}
                            >
                              <i className="material-icons">delete</i>
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
