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

const store = configureStore({
  reducer: {
    tasks: tasksReducer,
  },
});

const renderWithProvider = (ui: React.ReactElement) => {
  return render(<Provider store={store}>{ui}</Provider>);
};

describe("TaskList", () => {
  test("renders tasks", () => {
    renderWithProvider(<TaskList tasks={tasks} />);
    expect(screen.getByText("Task A")).toBeInTheDocument();
    expect(screen.getByText("Task B")).toBeInTheDocument();
  });

  test("sorts by due date by default", () => {
    renderWithProvider(<TaskList tasks={tasks} />);
    const taskTitles = screen.getAllByRole("heading"); // or use another selector depending on your Task component markup

    // The first task should be Task B (due earlier on 2025-08-18)
    expect(taskTitles[0]).toHaveTextContent("Task B");
  });

  test("sorts by priority when selected", () => {
    renderWithProvider(<TaskList tasks={tasks} />);
    fireEvent.change(screen.getByLabelText(/sort by/i), {
      target: { value: "priority" },
    });
    const taskTitles = screen.getAllByRole("heading");

    // Task A has priority Low(1), Task B High(3)
    // So with ascending sort, Task A should be first
    expect(taskTitles[0]).toHaveTextContent("Task A");
  });

  test("sorts by completion status", () => {
    renderWithProvider(<TaskList tasks={tasks} />);
    fireEvent.change(screen.getByLabelText(/sort by/i), {
      target: { value: "completed" },
    });
    const taskTitles = screen.getAllByRole("heading");

    // Task A is incomplete (false), Task B is completed (true)
    // Sorting by completion ascending means incomplete tasks first, so Task A first
    expect(taskTitles[0]).toHaveTextContent("Task A");
  });
});
