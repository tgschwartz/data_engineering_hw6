import React from "react";
import "./styles.css";

import { useImmer } from "use-immer";

const TasksApp = () => {
  const [appState, updateState] = useImmer({
    filterType: "all",
    tasks: [
      { id: 0, title: "uno", completed: true },
      { id: 1, title: "dos", completed: false }
    ]
  });

  const Task = ({ id, title, completed, toggleTask }) => {
    return (
      <li
        onClick={toggleTask}
        style={{
          textDecoration: completed ? "line-through" : "none"
        }}
      >
        {title}
      </li>
    );
  };

  const TaskForm = ({ taskAction }) => {
    // variable to hold a reference to the input
    let taskInput;

    const handleSubmit = event => {
      event.preventDefault();
      taskAction(taskInput.value);
      taskInput.value = "";
    };

    return (
      <form onSubmit={handleSubmit}>
        <label>
          <input ref={r => (taskInput = r)} type="text" />
        </label>
        <input type="submit" value="Create Task" />
      </form>
    );
  };

  const createTask = title => {
    updateState(draft => {
      draft.tasks.push({
        id: draft.tasks.length,
        title: title,
        completed: false
      });
    });
  };

  const toggleTask = id => {
    updateState(draft => {
      if (draft.tasks[id].completed === false) {
        draft.tasks[id].completed = true;
      } else if (draft.tasks[id].completed === true) {
        draft.tasks[id].completed = false;
      }
    });
  };

  const TodoFilter = ({ filterType, setFilterType }) => (
    <span>
      {["all", "completed", "active"].map((status, i) => {
        return (
          <button
            onClick={() => setFilterType(status)}
            disabled={appState.filterType === status}
          >
            {status}
          </button>
        );
      })}
    </span>
  );

  const filteredTasks = () => {
    if (appState.filterType === "all") {
      return appState.tasks;
    } else if (appState.filterType === "completed") {
      return appState.tasks.filter(task => task.completed === true);
    } else if (appState.filterType === "active") {
      return appState.tasks.filter(task => task.completed === false);
    }
  };

  const setFilterType = filterType => {
    updateState(draft => {
      draft.filterType = filterType;
    });
  };

  // uncomment out JSX blocks as you solve each problem
  // to uncomment, remove the enclosing '{/*' and '*/}'
  return (
    <div>
      {<TaskForm taskAction={createTask} />}
      <h3> Tasks </h3>

      {
        <TodoFilter
          filterType={appState.filterType}
          setFilterType={setFilterType}
        />
      }
      <ul>
        {filteredTasks().map(task => (
          <Task
            key={task.id}
            title={task.title}
            completed={task.completed}
            toggleTask={() => toggleTask(task.id)}
          />
        ))}
      </ul>
    </div>
  );
};

export default function App() {
  return (
    <div className="App">
      <TasksApp />
    </div>
  );
}
