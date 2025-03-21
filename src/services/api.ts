const API_BASE_URL = 'https://momentum.redberryinternship.ge/api';
const TOKEN = '9e688caf-d90c-4a5f-bbca-2e34d10290bd';

const headers = {
  'Authorization': `Bearer ${TOKEN}`,
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

const handleResponse = async (response: Response) => {
  console.log('Response status:', response.status);
  console.log('Response headers:', Object.fromEntries(response.headers.entries()));
  
  try {
    const contentType = response.headers.get('content-type');
    console.log('Content-Type:', contentType);
    
    const text = await response.text(); // Get response as text first
    console.log('Raw response:', text);
    
    let data;
    try {
      data = JSON.parse(text); // Try to parse as JSON
    } catch (e) {
      console.error('Failed to parse response as JSON:', text);
      throw new Error(`Invalid JSON response: ${text.substring(0, 100)}...`);
    }

    if (!response.ok) {
      console.error('API error response:', data);
      throw new Error(data.message || `API request failed with status ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error('API Response Error:', error);
    throw error; // Throw the actual error with details
  }
};

export const fetchTasks = async () => {
  const response = await fetch(`${API_BASE_URL}/tasks`, { headers });
  return handleResponse(response);
};

export const fetchStatuses = async () => {
  const response = await fetch(`${API_BASE_URL}/statuses`, { headers });
  return handleResponse(response);
};

export const fetchDepartments = async () => {
  const response = await fetch(`${API_BASE_URL}/departments`, { headers });
  return handleResponse(response);
};

export const fetchPriorities = async () => {
  const response = await fetch(`${API_BASE_URL}/priorities`, { headers });
  return handleResponse(response);
};

export const fetchEmployees = async () => {
  const response = await fetch(`${API_BASE_URL}/employees`, { headers });
  return handleResponse(response);
};

export const fetchLogoIcon = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/logos`, { headers });
    return handleResponse(response);
  } catch (error) {
    console.error("Error fetching logo icon:", error);
    return { icon: "" };
  }
};

export const fetchTaskById = async (taskId: number) => {
  try {
    console.log('Fetching task with ID:', taskId);
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      headers,
      method: 'GET'
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching task:', error);
    throw error;
  }
};

export const updateTask = async (id: number, taskData: {
  title: string;
  description: string;
  department_id: number;
  employee_id: number;
  priority_id: number;
  status_id: number;
  due_date?: string;
}) => {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(taskData),
  });
  return handleResponse(response);
};

export const createTask = async (taskData: {
  title: string;
  description: string;
  department_id: number;
  employee_id: number;
  priority_id: number;
  status_id: number;
  due_date?: string;
}) => {
  // Validate required fields
  if (!taskData.title || !taskData.department_id || !taskData.employee_id || 
      !taskData.priority_id || !taskData.status_id) {
    throw new Error('Missing required fields');
  }

  if (taskData.title.length < 2 || taskData.title.length > 255) {
    throw new Error('Title must be between 2 and 255 characters');
  }

  try {
    console.log('Creating task with data:', taskData);
    
    // Ensure all ID fields are numbers
    const requestData = {
      name: taskData.title,  // Convert title to name for the API
      description: taskData.description,
      department_id: Number(taskData.department_id),
      employee_id: Number(taskData.employee_id),
      priority_id: Number(taskData.priority_id),
      status_id: Number(taskData.status_id),
      due_date: taskData.due_date || null,
    };
    
    console.log('Formatted request data:', requestData);
    
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestData),
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      try {
        const errorJson = JSON.parse(errorText);
        throw new Error(errorJson.message || `Failed with status ${response.status}`);
      } catch (e) {
        throw new Error(`Failed with status ${response.status}: ${errorText.substring(0, 100)}`);
      }
    }
    
    // Special handling for task creation response
    const responseText = await response.text();
    console.log('Task creation response:', responseText);
    
    try {
      if (responseText) {
        return JSON.parse(responseText);
      } else if (response.status === 201) {
        // If we got a 201 Created but no body, we'll consider it a success
        // This is a fallback in case the API doesn't return the created task
        return { id: Date.now(), success: true };
      }
    } catch (e) {
      console.error('Failed to parse response JSON:', e);
    }
    
    // If we can't parse the response or there's no body but the status is good,
    // return a basic success response
    return { success: true };
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

export interface CommentResponse {
  id: number;
  text: string;
  task_id: number;
  parent_id: number | null;
  author_avatar: string;
  author_nickname: string;
  created_at: string;
  sub_comments?: CommentResponse[];
}

export interface CreateCommentRequest {
  text: string;
  parent_id?: number | null;
}

export const fetchComments = async (taskId: number): Promise<CommentResponse[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/comments`, {
      method: 'GET',
      headers
    });

    if (!response.ok) {
      throw new Error('Failed to fetch comments');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

export const createComment = async (taskId: number, text: string, parentId?: number): Promise<CommentResponse> => {
  // Validate comment text
  if (!text.trim()) {
    throw new Error('Comment text is required');
  }

  if (text.length < 2 || text.length > 500) {
    throw new Error('Comment text must be between 2 and 500 characters');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/comments`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        text: text.trim(),
        parent_id: parentId || null
      } as CreateCommentRequest),
    });

    if (!response.ok) {
      throw new Error('Failed to create comment');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
};

export const createEmployee = async (employeeData: {
  name: string;
  surname: string;
  department_id: number;
  position?: string;
  avatar?: string;
}) => {
  // Validate required fields
  if (!employeeData.name || !employeeData.surname || !employeeData.department_id) {
    throw new Error('Missing required employee fields');
  }

  try {
    console.log('Creating employee with data:', employeeData);
    
    const requestData = {
      name: employeeData.name,
      surname: employeeData.surname,
      department_id: Number(employeeData.department_id),
      position: employeeData.position || '',
      avatar: employeeData.avatar || null
    };
    
    const response = await fetch(`${API_BASE_URL}/employees`, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestData),
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      try {
        const errorJson = JSON.parse(errorText);
        throw new Error(errorJson.message || `Failed with status ${response.status}`);
      } catch (e) {
        throw new Error(`Failed with status ${response.status}: ${errorText.substring(0, 100)}`);
      }
    }
    
    const responseText = await response.text();
    console.log('Employee creation response:', responseText);
    
    try {
      if (responseText) {
        return JSON.parse(responseText);
      }
    } catch (e) {
      console.error('Failed to parse response JSON:', e);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error creating employee:', error);
    throw error;
  }
};