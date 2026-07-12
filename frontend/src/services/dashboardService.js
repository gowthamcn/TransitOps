const API_URL = "http://localhost:5000/api/dashboard";

export const getDashboardStats = async (filters) => {

  const token =
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  const params = new URLSearchParams(filters);

  const response = await fetch(
    `${API_URL}?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data.data;
};