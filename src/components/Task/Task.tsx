import React from "react";
import { Task as TaskType } from "../../types/types";
import { useDispatch } from "react-redux";
import { deleteTask, updateTask } from "../../features/taskSlice";

interface TaskProps {
  task: TaskType;
}

const Task: React.FC<TaskProps> = ({ task }: TaskProps) => {
  const dispatch = useDispatch();

  const handleToggleCompletion = () => {
    dispatch(updateTask({ ...task, completed: !task.completed }));
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      dispatch(deleteTask(task.id));
    }
  };

  return (
    <div className="flex justify-between items-center p-4 border-b">
      <div>
        <h3
          className={`font-bold ${
            task.completed ? "line-through text-gray-500" : ""
          }`}
        >
          {task.title}
        </h3>
        <p className="text-sm text-gray-600">{task.description}</p>
        <p className="text-xs text-gray-400">
          {task.priority} | Due: {task.dueDate}
        </p>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={handleToggleCompletion}
          className={`px-2 py-1 text-white rounded ${
            task.completed ? "bg-green-500" : "bg-blue-500"
          }`}
        >
          {task.completed ? "Undo" : "Complete"}
        </button>
        <button
          onClick={handleDelete}
          className="px-2 py-1 text-white bg-red-500 rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default Task;
