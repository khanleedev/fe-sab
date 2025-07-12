import axios from "axios";
import Cookies from "js-cookie";

const baseURL = "https://sab-be.onrender.com";

export const instance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
  params: {},
  withCredentials: true,
  timeout: 10000, // 10 seconds timeout
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

instance.interceptors.request.use(
  (config) => {
    console.log(`Request: ${config.method.toUpperCase()} ${config.url}, Headers:`, config.headers);
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken && !config.url.includes("/v1/auth/login") && !config.url.includes("/v1/auth/refresh")) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    console.log(`Response: ${response.config.url}, Status: ${response.status}, Headers:`, response.headers);
    return response;
  },
  async (error) => {
    console.error(`Response Error: ${error.config?.url}, Status: ${error.response?.status}, Message:`, error.message);
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return instance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = Cookies.get("rft");
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const response = await instance.post("/v1/auth/refresh", null, {
          headers: { "X-Refresh-Token": refreshToken },
        });

        const newAccessToken = response.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);
        if (response.data.refreshToken) {
          Cookies.set("rft", response.data.refreshToken, { expires: 7, secure: true, sameSite: "Strict" });
        }

        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);
        return instance(originalRequest);
      } catch (err) {
        processQueue(err, null);
        localStorage.removeItem("accessToken");
        Cookies.remove("rft");
        localStorage.removeItem("userKind");
        window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export const instanceFile = axios.create({
  baseURL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
  params: {},
  withCredentials: true,
  timeout: 10000,
});

instanceFile.interceptors.request.use(
  (config) => {
    console.log(`File Request: ${config.method.toUpperCase()} ${config.url}, Headers:`, config.headers);
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken && !config.url.includes("/v1/auth/login") && !config.url.includes("/v1/auth/refresh")) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    console.error("File Request Error:", error);
    return Promise.reject(error);
  }
);

instanceFile.interceptors.response.use(
  (response) => {
    console.log(`File Response: ${response.config.url}, Status: ${response.status}, Headers:`, response.headers);
    return response; // Return full response for consistency
  },
  async (error) => {
    console.error(`File Response Error: ${error.config?.url}, Status: ${error.response?.status}, Message:`, error.message);
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return instanceFile(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = Cookies.get("rft");
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const response = await instance.post("/v1/auth/refresh", null, {
          headers: { "X-Refresh-Token": refreshToken },
        });

        const newAccessToken = response.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);
        if (response.data.refreshToken) {
          Cookies.set("rft", response.data.refreshToken, { expires: 7, secure: true, sameSite: "Strict" });
        }

        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);
        return instanceFile(originalRequest);
      } catch (err) {
        processQueue(err, null);
        localStorage.removeItem("accessToken");
        Cookies.remove("rft");
        localStorage.removeItem("userKind");
        window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);