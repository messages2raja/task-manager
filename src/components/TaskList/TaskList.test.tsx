import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import TaskList from "./TaskList";
import tasksReducer from "../../features/taskSlice";
import { Task } from "../../types/types";
import "@testing-library/jest-dom";

const tasks: Task[] = [
  {
    id: "1",
    title: "Task A",
    description: "Desc A",
    completed: false,
    dueDate: "2025-08-20",
    priority: "low",
  },
  {
    id: "2",
    title: "Task B",
    description: "Desc B",
    completed: true,
    dueDate: "2025-08-18",
    priority: "high",
  },
];

const renderWithProvider = (ui: React.ReactElement) => {
  const store = configureStore({
    reducer: {
      tasks: tasksReducer,
    },
    preloadedState: {
      tasks: {
        tasks: tasks,
      },
    },
  });
  const utils = render(<Provider store={store}>{ui}</Provider>);
  return { store, ...utils };
};

describe("TaskList", () => {
  test("renders tasks", () => {
    renderWithProvider(<TaskList tasks={tasks} />);
    expect(screen.getByText("Task A")).toBeInTheDocument();
    expect(screen.getByText("Task B")).toBeInTheDocument();
  });

  test("sorts by due date by default", () => {
    renderWithProvider(<TaskList tasks={tasks} />);
    const taskTitles = screen.getAllByRole("heading");
    expect(taskTitles[0]).toHaveTextContent("Task B");
  });

  test("sorts by priority when selected", () => {
    renderWithProvider(<TaskList tasks={tasks} />);
    fireEvent.change(screen.getByLabelText(/sort by/i), {
      target: { value: "priority" },
    });
    const taskTitles = screen.getAllByRole("heading");
    expect(taskTitles[0]).toHaveTextContent("Task A");
  });

  test("sorts by completion status", () => {
    renderWithProvider(<TaskList tasks={tasks} />);
    fireEvent.change(screen.getByLabelText(/sort by/i), {
      target: { value: "completed" },
    });
    const taskTitles = screen.getAllByRole("heading");
    expect(taskTitles[0]).toHaveTextContent("Task A");
  });

  test("selects multiple tasks and toggles completion", () => {
    const { store } = renderWithProvider(<TaskList tasks={tasks} />);

    fireEvent.click(screen.getByLabelText(/Select task Task A/i));
    fireEvent.click(screen.getByLabelText(/Select task Task B/i));

    fireEvent.click(screen.getByText(/Toggle Complete/i));

    const actions = store.getState().tasks.tasks;
    expect(actions.find((t) => t.id === "1")?.completed).toBe(true);
    expect(actions.find((t) => t.id === "2")?.completed).toBe(false);
  });

  test("deletes selected tasks", () => {
    const { store } = renderWithProvider(<TaskList tasks={tasks} />);

    jest.spyOn(window, "confirm").mockReturnValueOnce(true);

    fireEvent.click(screen.getByLabelText(/Select task Task A/i));

    fireEvent.click(screen.getByText(/Delete Selected/i));

    const remainingTasks = store.getState().tasks.tasks;
    expect(remainingTasks).toHaveLength(1);
    expect(remainingTasks[0].id).toBe("2");
  });
});
