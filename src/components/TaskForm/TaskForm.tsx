import React, { useState } from "react";
import { Task } from "../../types/types";
import { useDispatch, useSelector } from "react-redux";
import { setTasks } from "../../features/taskSlice";
import { RootState } from "../../store";
import { getLocalStorage, setLocalStorage } from "../../utils/localStorage";

const TaskForm = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);

  // Form fields state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");
  const [dueDate, setDueDate] = useState("");

  // Validation state
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    dueDate?: string;
  }>({});

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (dueDate && isNaN(Date.parse(dueDate)))
      newErrors.dueDate = "Please enter a valid date";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate: dueDate || new Date().toISOString().split("T")[0],
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedTasks = [...tasks, newTask];
    dispatch(setTasks(updatedTasks));
    setLocalStorage("tasks", updatedTasks);

    // Reset form
    setTitle("");
    setDescription("");
    setPriority("medium");
    setDueDate("");
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded space-y-4">
      <div>
        <label htmlFor="title" className="block font-medium">
          Title
        </label>
        <input
          id="title"
          className={`w-full p-2 border rounded ${
            errors.title ? "border-red-500" : ""
          }`}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
      </div>
      <div>
        <label htmlFor="description" className="block font-medium">
          Description
        </label>
        <textarea
          id="description"
          className={`w-full p-2 border rounded ${
            errors.description ? "border-red-500" : ""
          }`}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description}</p>
        )}
      </div>
      <div>
        <label htmlFor="priority" className="block font-medium">
          Priority
        </label>
        <select
          id="priority"
          className="w-full p-2 border rounded"
          value={priority}
          onChange={(e) =>
            setPriority(e.target.value as "high" | "medium" | "low")
          }
        >
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
      <div>
        <label htmlFor="dueDate" className="block font-medium">
          Due Date
        </label>
        <input
          type="date"
          id="dueDate"
          className={`w-full p-2 border rounded ${
            errors.dueDate ? "border-red-500" : ""
          }`}
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        {errors.dueDate && (
          <p className="text-red-500 text-sm">{errors.dueDate}</p>
        )}
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-green-500 text-white rounded"
      >
        Add Task
      </button>
    </form>
  );
};

export default TaskForm;
