import React, { useEffect, useState } from "react";
import { fetchTasks, fetchStatuses } from "../services/api";
import TaskCard from "../components/TaskCard";

interface Status {
  id: number;
  name: string;
}

interface Task {
  id: number;
  name: string;
  description: string;
  due_date: string;
  status: {
    id: number;
    name: string;
  };
  priority: {
    id: number;
    name: string;
    icon: string;
  };
}



const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [tasksData, statusesData] = await Promise.all([
          fetchTasks(),
          fetchStatuses(),
        ]);
        console.log("Tasks:", tasksData);
        console.log("Statuses", statusesData);
        setTasks(tasksData);
        setStatuses(statusesData);
      } catch (err) {
        setError("დაფიქსირდა შეცდომა მონაცემების მიღებისას");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <p>იტვირთება...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">დავალებების გვერდი</h1>

      <div className="grid grid-cols-4 gap-4">
        {statuses.map((status) => (
          <div key={status.id} className="bg-white p-4 shadow-md rounded-md">
            <h2 className="text-xl font-bold text-white p-2 rounded-md bg-blue-500">
              {status.name}
            </h2>
            <ul className="mt-2 space-y-2">
              {tasks
                .filter((task) => task.status.id === status.id)
                .map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;