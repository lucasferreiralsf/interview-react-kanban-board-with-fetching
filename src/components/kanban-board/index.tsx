import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Task } from "../../models/task";
import {
  addNewTask,
  getAllTasks,
  removeTask,
  updateTaskStage,
} from "../../services";
import "./index.css";

const stagesNames = ["Backlog", "To Do", "In Progress", "Done"] as const;

export default function KanbanBoard() {
  // Each task is uniquely identified by its name.
  // Therefore, when you perform any operation on tasks,
  // make sure you pick tasks by names (primary key)
  // instead of any kind of index or any other attribute.

  // Convert this to fetching from `GET /tasks` endpoint
  // const [tasks, setTasks] = useState<Task[]>([]);
  // const [stagesTasks, setStagesTasks] = useState<Task[][]>(
  //   stagesNames.map(() => []),
  // );
  const queryClient = useQueryClient();
  const [newTaskValue, setNewTaskValue] = useState("");
  const { data: tasks } = useQuery({
    queryKey: ["todos"],
    queryFn: getAllTasks,
  });

  const stagesTasks = useMemo(() => {
    const stages: Task[][] = stagesNames.map(() => []);
    if (tasks) {
      for (const task of tasks) {
        const stageId = task.stage;
        stages[stageId].push(task);
      }
    }
    return stages;
  }, [tasks]);

  const addNewTaskMutation = useMutation({
    mutationFn: addNewTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      setNewTaskValue("");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const removeTaskMutation = useMutation({
    mutationFn: removeTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateTaskStageMutation = useMutation({
    mutationFn: updateTaskStage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleCreateTask = () => {
    if (newTaskValue.length > 0) {
      addNewTaskMutation.mutate({
        name: newTaskValue,
        stage: 0,
      });
    }
  };

  const handleSendTaskToNext = ({ name, stage }: Task) => {
    updateTaskStageMutation.mutate({
      name,
      stage:
        stage < stagesNames.length - 1 ? stage + 1 : stagesNames.length - 1,
    });
  };

  const handleSendTaskBack = ({ name, stage }: Task) => {
    updateTaskStageMutation.mutate({
      name,
      stage: stage > 0 ? stage - 1 : 0,
    });
  };

  const handleDeleteTask = (name: string) => {
    removeTaskMutation.mutate(name);
  };

  // Routes:
  // `GET`   `/tasks`; returns `200` with all tasks (`Task[]`)
  // `POST`  `/tasks`; returns `200` with the new task (`Task`), a `400` with a user-input-related error message,
  //          or a `500` with a server-related error message
  // `DELETE` `/tasks/:name`; returns `200`, a `400` with a user-input-related error message,
  //          or a `500` with a server-related error message

  return (
    <div className="mt-20 layout-column justify-content-center align-items-center">
      <section className="mt-50 layout-row align-items-center justify-content-center">
        <input
          id="create-task-input"
          type="text"
          className="large"
          placeholder="New task name"
          data-testid="create-task-input"
          value={newTaskValue}
          onChange={(e) => setNewTaskValue(e.target.value)}
        />
        <button
          type="submit"
          className="ml-30"
          data-testid="create-task-button"
          onClick={handleCreateTask}
        >
          Create task
        </button>
      </section>

      <div className="mt-50 layout-row wrap default-gap justify-content-center">
        {stagesTasks.map((tasks, i) => {
          return (
            <div className="card outlined mt-0" key={`${i}`}>
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
                              disabled={task.stage === 0}
                              onClick={() => handleSendTaskBack(task)}
                            >
                              <i className="material-icons">arrow_back</i>
                            </button>
                            <button
                              className="icon-only x-small mx-2"
                              data-testid={`${task.name
                                .split(" ")
                                .join("-")}-forward`}
                              disabled={task.stage === stagesNames.length - 1}
                              onClick={() => handleSendTaskToNext(task)}
                            >
                              <i className="material-icons">arrow_forward</i>
                            </button>
                            <button
                              className="icon-only danger x-small mx-2"
                              data-testid={`${task.name
                                .split(" ")
                                .join("-")}-delete`}
                              onClick={() => handleDeleteTask(task.name)}
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
