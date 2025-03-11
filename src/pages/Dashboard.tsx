import React, {useEffect, useState} from 'react';
import { fetchTasks } from '../services/api'

interface Task {
  id: number;
  title: string;
  status: string;
}

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const tasks = await fetchTasks();
        setTasks(tasks);
      } catch (error) {
        setError("Failed to fetch tasks");
      } finally {
        setLoading(false);
      }
    };
    loadTasks();
  }, []);

  if (loading) return <p>Loading tasks...</p>;
  if (error) return <p className='text-red-500'>{error}</p>;

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold'>Dashboard</h1>
      <ul className='space-y-2'>
        {tasks.map((task) => (
          <li key={task.id} className='border p2 rounded-md shadow-md'>
            <p className='text-lg font-semibold'>{task.title}</p>
            <span className='text-gray-600'>{task.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
  
};

export default Dashboard;