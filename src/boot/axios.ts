import axios from "axios";

const getBaseURL = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    console.log(
      "Verwende Umgebungsvariable VITE_API_BASE_URL:",
      import.meta.env.VITE_API_BASE_URL
    );
    return import.meta.env.VITE_API_BASE_URL;
  }

  const currentDomain = window.location.hostname;
  console.log("Aktuelle Domain:", currentDomain);

  const isLocal =
    currentDomain === "localhost" || currentDomain === "127.0.0.1";

  const baseURL = isLocal
    ? `http://localhost:5008/`
    : `https://${currentDomain}/`;

  console.log("Basis-URL:", baseURL);
  return baseURL;
};

const api = axios.create({
  baseURL: getBaseURL(),
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
    return Promise.reject(error);
  }
);

export default api;
