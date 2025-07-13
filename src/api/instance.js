import axios from "axios";
import UseCookie from "../hooks/UseCookie";

const baseURL = "https://sab-be.onrender.com";

export const instance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  params: {},
  withCredentials: true,
  timeout: 10000,
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

const responseInterceptor = async function (error) {
  const originalRequest = error.config;
  if (
    error.response &&
    error.response.status === 401 &&
    !originalRequest._retry
  ) {
    if (isRefreshing) {
      return new Promise(function (resolve, reject) {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers["Authorization"] = "Bearer " + token;
          return instance(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { getToken, saveToken } = UseCookie();
      const { refresh_token } = getToken();
      if (!refresh_token) throw new Error("No refresh token found");
      const formData = new FormData();
      formData.append("refresh_token", refresh_token);

      console.log("Refreshing token with data:", formData);
      const res = await instanceFile.post("/v1/auth/refresh", formData);
      const newAccessToken = res.data.data.accessToken;
      const newRefreshToken = res.data.data.refreshToken;
      console.log(
        `New tokens received: Access Token: ${newAccessToken}, Refresh Token: ${newRefreshToken}`
      );
      saveToken(newAccessToken, newRefreshToken);

      instance.defaults.headers.common["Authorization"] =
        "Bearer " + newAccessToken;
      processQueue(null, newAccessToken);
      return instance(originalRequest);
    } catch (err) {
      processQueue(err, null);
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
  return Promise.reject(error);
};

instance.interceptors.response.use((response) => response, responseInterceptor);

export const instanceFile = axios.create({
  baseURL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
  params: {},
  withCredentials: true,
  timeout: 10000,
});

instanceFile.interceptors.response.use(
  (response) => response,
  responseInterceptor
);
// export const instancePushNotification = axios.create({
//   baseURL: basePushNotificationURL,
//   headers: {
//     "Content-Type": "application/json",
//   },
//   params: {},
// });
// instancePushNotification.interceptors.response.use(
//   function (response) {
//     if (response.data) {
//       return response.data;
//     }
//     return response;
//   },
//   function (error) {
//     return Promise.reject(error);
//   }
// );
