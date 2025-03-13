import React, { useEffect, useState } from "react";
import { fetchTasks, fetchStatuses } from "../services/api";

interface Task {
  id: number;
  title: string;
  description: string;
  due_date: string;
  status: {
    id: number;
    name: string;
  };
}

interface Status {
  id: number;
  name: string;
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
      <h1 className="text-2xl font-bold mb-4">დავალებების მართვა</h1>

      <div className="grid grid-cols-4 gap-4">
        {statuses.map((status) => (
          <div key={status.id} className="bg-white p-4 shadow-md rounded-md">
            <h2 className="text-xl font-bold text-white p-2 rounded-md bg-blue-500">
              {status.name}
            </h2>
            <ul className="mt-2 space-y-2">
              {tasks
                .filter((task) => task.status.id === status.id).map((task) => (
                  <li key={task.id} className="border p-2 rounded-md shadow-md">
                    <p className="text-lg font-semibold">{task.title}</p>
                    <p className="text-gray-600">{task.description}</p>
                    <p className="text-sm text-gray-400">
                      {new Date(task.due_date).toDateString()}
                    </p>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;