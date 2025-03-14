const API_BASE_URL = "https://momentum.redberryinternship.ge/api";

export const fetchTasks = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      headers: {
        "content-type": "application/json",
        authorization
        : "bearer 9e688caf-d90c-4a5f-bbca-2e34d10290bd",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch tasks");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching tasks", error);
    throw error;
  }
};

export const fetchStatuses = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/statuses`, {
      headers: {
        "content-type": "application/json",
        authorization: "bearer 9e688caf-d90c-4a5f-bbca-2e34d10290bd",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch statuses");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching statuses", error);
    throw error;
  }
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