import React from 'react';

const mockTasks = [
  {id: 1, title: "Comlete React Task", status: "In Progress"},
  {id: 2, title: "Fix Backend API", status: "To Do"},
  {id: 3 , title: "Review PRs", status: "Done"},
];

const Dashboard: React.FC = () => {
  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold'>Dashboard</h1>
      <ul className='space-y-2'>
        {mockTasks.map(task => (
          <li key={task.id} className='border p-2 rounded-md shadow-md'>
            <p className='text-lg font-semibold' >{task.title}</p>
            <span className='text-gray-600'>{task.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;