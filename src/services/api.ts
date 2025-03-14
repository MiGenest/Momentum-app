const API_BASE_URL = 'https://momentum.redberryinternship.ge/api';
const TOKEN = '9e688caf-d90c-4a5f-bbca-2e34d10290bd';

const headers = {
  'Authorization': `Bearer ${TOKEN}`,
  'Content-Type': 'application/json',
};

export const fetchTasks = async () => {
  const response = await fetch(`${API_BASE_URL}/tasks`, { headers });
  if (!response.ok) throw new Error('Failed to fetch tasks');
  return response.json();
};

export const fetchStatuses = async () => {
  const response = await fetch(`${API_BASE_URL}/statuses`, { headers });
  if (!response.ok) throw new Error('Failed to fetch statuses');
  return response.json();
};

export const fetchDepartments = async () => {
  const response = await fetch(`${API_BASE_URL}/departments`, { headers });
  if (!response.ok) throw new Error('Failed to fetch departments');
  return response.json();
};

export const fetchPriorities = async () => {
  const response = await fetch(`${API_BASE_URL}/priorities`, { headers });
  if (!response.ok) throw new Error('Failed to fetch priorities');
  return response.json();
};

export const fetchEmployees = async () => {
  const response = await fetch(`${API_BASE_URL}/employees`, { headers });
  if (!response.ok) throw new Error('Failed to fetch employees');
  return response.json();
};

export const fetchLogoIcon = async () => {
  try {
      const response = await fetch("https://momentum.redberryinternship.ge/api/logos",); 
      const data = await response.json();
      return data;
  } catch (error) {
      console.error("Error fetching logo icon:", error);
      return { icon: "" };
  }
};