import React, { useState } from "react";
import { Task as TaskType } from "../../types/types";
import Task from "../Task/Task";
import { useDispatch } from "react-redux";
import { deleteTask, updateTask } from "../../features/taskSlice";
interface TaskListProps {
  tasks: TaskType[];
}

const TaskList = ({ tasks }: TaskListProps) => {
  const [sortBy, setSortBy] = useState<string>("dueDate");
  const dispatch = useDispatch();
  // Sort the tasks array based on the selected criteria
  const sortedTasks = [...tasks].sort((a, b) => {
    switch (sortBy) {
      case "priority":
        const priorityOrder = { Low: 1, Medium: 2, High: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      case "dueDate":
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      case "completed":
        return Number(a.completed) - Number(b.completed);
      default:
        return 0;
    }
  });

  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

  const toggleTaskSelection = (id: string) => {
    setSelectedTasks((prev) =>
      prev.includes(id) ? prev.filter((taskId) => taskId !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedTasks.length === sortedTasks.length) {
      setSelectedTasks([]); // Deselect all
    } else {
      setSelectedTasks(sortedTasks.map((t) => t.id)); // Select all
    }
  };
  const handleBulkDelete = () => {
    if (window.confirm("Delete selected tasks?")) {
      selectedTasks.forEach((id) => dispatch(deleteTask(id)));
      setSelectedTasks([]);
    }
  };

  const handleBulkToggleCompletion = () => {
    selectedTasks.forEach((id) => {
      const task = tasks.find((t) => t.id === id);
      if (task) {
        dispatch(updateTask({ ...task, completed: !task.completed }));
      }
    });
    setSelectedTasks([]);
  };

  return (
    <div>
      <div className="mt-4 mb-4 flex space-x-2">
        <label htmlFor="sort" className="mr-2 font-semibold">
          Sort by:
        </label>
        <select
          id="sort"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border rounded p-1"
        >
          <option value="dueDate">Due Date</option>
          <option value="priority">Priority</option>
          <option value="completed">Completion</option>
        </select>
        <button
          onClick={selectAll}
          className="bg-gray-300 text-white px-3 py-1 rounded"
        >
          {selectedTasks.length === sortedTasks.length
            ? "Deselect All"
            : "Select All"}
        </button>
        <button
          onClick={handleBulkToggleCompletion}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Toggle Complete
        </button>
        <button
          onClick={handleBulkDelete}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Delete Selected
        </button>
      </div>

      {sortedTasks.map((task) => (
        <Task
          key={task.id}
          task={task}
          isSelected={selectedTasks.includes(task.id)}
          onSelect={() => toggleTaskSelection(task.id)}
        />
      ))}
    </div>
  );
};

export default TaskList;
