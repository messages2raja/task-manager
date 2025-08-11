import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTasks } from "./features/taskSlice";
import { getLocalStorage } from "./utils/localStorage";
import TaskList from "./components/TaskList/TaskList";
import { RootState } from "./store";
import { Task } from "./types/types";
import TaskForm from "./components/TaskForm/TaskForm";

function App() {
  const dispatch = useDispatch();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);

  useEffect(() => {
    const savedTasks = getLocalStorage<Task[]>("tasks");
    if (savedTasks) {
      dispatch(setTasks(savedTasks));
    }
  }, [dispatch]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Task Manager</h1>
      <TaskForm />
      <TaskList tasks={tasks} />
    </div>
  );
}

export default App;
