// Centralized API call utilities using fetch

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const apiFetch = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "API Error");
    }

    return response;
  } catch (err) {
    console.error(`API Fetch Error: ${err.message}`);
    throw err;
  }
};
