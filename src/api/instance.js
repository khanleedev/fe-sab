import axios from "axios";
// const baseURL = "https://social-networking-api.up.railway.app";
// const baseURL = "http://localhost:8888";
const baseURL = "https://sab-be.onrender.com";
// const basePushNotificationURL =
//   "https://familycircle-firebaseserver.onrender.com";
export const instance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  params: {},
  withCredentials: true,
  timeout: 10000, // Set timeout to 10 seconds
});
instance.interceptors.response.use(
  function (response) {
    if (response.data) {
      return response.data;
    }
    return response;
  },
  function (error) {
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
  timeout: 10000, // Set timeout to 10 seconds
});
instanceFile.interceptors.response.use(
  function (response) {
    if (response.data) {
      return response.data;
    }
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
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
