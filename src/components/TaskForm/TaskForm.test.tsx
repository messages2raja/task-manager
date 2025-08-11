import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TaskForm from "./TaskForm";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import taskReducer from "../../features/taskSlice";
import "@testing-library/jest-dom";
// Helper to render component with redux store
const renderWithProvider = (
  ui: React.ReactElement,
  { store }: { store: any }
) => {
  return render(<Provider store={store}>{ui}</Provider>);
};

// Mock localStorage setItem
const setLocalStorageMock = jest.fn();
jest.mock("../../utils/localStorage", () => ({
  setLocalStorage: (key: string, value: any) => setLocalStorageMock(key, value),
  getLocalStorage: jest.fn(),
}));

describe("TaskForm component", () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({
      reducer: { tasks: taskReducer },
      preloadedState: { tasks: { tasks: [] } },
    });
    setLocalStorageMock.mockClear();
  });

  test("renders form inputs and button", () => {
    renderWithProvider(<TaskForm />, { store });
    expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Priority/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Due Date/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Add Task/i })
    ).toBeInTheDocument();
  });

  test("shows validation errors on empty submit", () => {
    renderWithProvider(<TaskForm />, { store });
    fireEvent.click(screen.getByRole("button", { name: /Add Task/i }));

    expect(screen.getByText(/Title is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Description is required/i)).toBeInTheDocument();
  });
});
