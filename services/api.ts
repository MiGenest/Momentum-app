const API_BASE_URL = "https://momentum.redberryinternship.ge/api"

export const fetchTasks = async () => {
    const response = await fetch('${API_BASE_URL}/tasks', {
        headers: {
            authorization: 'bearer 9e688caf-d90c-4a5f-bbca-2e34d10290bd'
        }
    })
    if (!response.ok) {
        throw new Error('Failed to fetch tasks')
    }
    return response.json()
}