import React, { useState } from "react";
import { Task as TaskType } from "../../types/types";
import Task from "../Task/Task";

interface TaskListProps {
  tasks: TaskType[];
}

const TaskList = ({ tasks }: TaskListProps) => {
  const [sortBy, setSortBy] = useState<string>("dueDate");

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

  return (
    <div>
      {/* Sorting options */}
      <div className="mt-4 mb-4">
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
      </div>

      {/* Render sorted tasks */}
      {sortedTasks.map((task) => (
        <Task key={task.id} task={task} />
      ))}
    </div>
  );
};

export default TaskList;
