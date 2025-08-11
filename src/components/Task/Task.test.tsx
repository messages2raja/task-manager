import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Task from "./Task";
import { useDispatch } from "react-redux";
import { deleteTask, updateTask } from "../../features/taskSlice";
import { Task as TaskType } from "../../types/types";
import "@testing-library/jest-dom";
// Mock react-redux
jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
}));

const mockTask: TaskType = {
  id: "1",
  title: "Test Task",
  description: "Test Description",
  completed: false,
  priority: "medium",
  dueDate: "2025-08-20",
};

describe("Task component without Provider", () => {
  let mockDispatch: jest.Mock;

  beforeEach(() => {
    mockDispatch = jest.fn();
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    jest.clearAllMocks();
  });

  test("renders task details", () => {
    render(<Task task={mockTask} />);
    expect(screen.getByText("Test Task")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
  });

  test("dispatches updateTask on complete button click", () => {
    render(<Task task={mockTask} />);
    fireEvent.click(screen.getByText("Complete"));
    expect(mockDispatch).toHaveBeenCalledWith(
      updateTask({ ...mockTask, completed: true })
    );
  });

  test("dispatches deleteTask on delete button click when confirmed", () => {
    jest.spyOn(window, "confirm").mockReturnValue(true);
    render(<Task task={mockTask} />);
    fireEvent.click(screen.getByText("Delete"));
    expect(mockDispatch).toHaveBeenCalledWith(deleteTask(mockTask.id));
  });

  test("does not dispatch deleteTask when cancelled", () => {
    jest.spyOn(window, "confirm").mockReturnValue(false);
    render(<Task task={mockTask} />);
    fireEvent.click(screen.getByText("Delete"));
    expect(mockDispatch).not.toHaveBeenCalled();
  });
});
