import axios from "axios";

const API_BASE_URL = import.meta.env.FASTAPI_LINK; // Ensure this matches your FastAPI server URL

// Function to send chat input to the FastAPI backend
export const sendChatMessage = async (userId, message) => {
  try {
    // Send the chat message in JSON format
    const response = await axios.post(`${API_BASE_URL}/chat/${userId}`, {
      user_id: userId,
      message: message, // sending JSON message
    });

    // Check if the response is in JSON format
    return response.data; // assuming the response is a JSON object with structured data
  } catch (error) {
    throw error.response ? error.response.data : new Error("Server Error");
  }
};
