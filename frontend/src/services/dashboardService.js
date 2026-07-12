const API_URL = "http://localhost:5000/api/dashboard";

export const getDashboardStats = async () => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  const response = await fetch(API_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch dashboard data");
  }

  return data.data;
};