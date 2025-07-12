import { instance, instanceFile } from "../api/instance";
import UseCookie from "./UseCookie";

function UseCallApi() {
  const { getToken } = UseCookie();

  // GET
  const UseGet = ({
    url = "",
    params = {},
    headers = {},
    requiredToken = false,
  } = {}) => {
    let fullHeader = { ...headers };
    if (requiredToken) {
      const tokenData = getToken();
      console.log("Token data (UseGet):", tokenData);
      const accessToken = tokenData?.access_token;
      const refreshToken = tokenData?.refresh_token;

      if (accessToken) {
        fullHeader["Authorization"] = `Bearer ${accessToken}`;
      } else if (refreshToken) {
        fullHeader["Authorization"] = `Bearer ${refreshToken}`;
      } else {
        console.error("No valid token found");
      }
      console.log(
        "Authorization header (UseGet):",
        fullHeader["Authorization"]
      );
    } else {
      console.log("No Authorization header added (requiredToken: false)");
    }

    const usedGet = () =>
      instance.get(url, {
        headers: {
          Authorization: fullHeader["Authorization"],
          ...instance.defaults.headers,
          ...fullHeader,
        },
        params,
      });
    return usedGet();
  };

  // POST
  const UsePost = ({
    url = "",
    params = {},
    headers = {},
    requiredToken = false,
  } = {}) => {
    let fullHeader = { ...headers };
    console.log("FUll Header", fullHeader);
    if (requiredToken) {
      const tokenData = getToken();
      console.log("Token data (UsePost):", tokenData);
      const accessToken = tokenData?.access_token;
      const refreshToken = tokenData?.refresh_token;

      if (accessToken) {
        fullHeader["Authorization"] = `Bearer ${accessToken}`;
      } else if (refreshToken) {
        fullHeader["Authorization"] = `Bearer ${refreshToken}`;
      } else {
        console.error("No valid token found");
      }
      console.log(
        "Authorization header (UsePost):",
        fullHeader["Authorization"]
      );
    } else {
      console.log("No Authorization header added (requiredToken: false)");
    }

    const usedPost = () =>
      instance.post(
        url,
        { ...params },
        {
          headers: {
            Authorization: fullHeader["Authorization"],
            ...instance.defaults.headers,
            ...fullHeader,
          },
        }
      );
    return usedPost();
  };

  // DELETE
  const UseDelete = ({
    url = "",
    params = {},
    headers = {},
    requiredToken = false,
  } = {}) => {
    let fullHeader = { ...headers };
    if (requiredToken) {
      const tokenData = getToken();
      console.log("Token data (UseDelete):", tokenData);
      const accessToken = tokenData?.access_token;
      const refreshToken = tokenData?.refresh_token;

      if (accessToken) {
        fullHeader["Authorization"] = `Bearer ${accessToken}`;
      } else if (refreshToken) {
        fullHeader["Authorization"] = `Bearer ${refreshToken}`;
      } else {
        console.error("No valid token found");
      }
      console.log(
        "Authorization header (UseDelete):",
        fullHeader["Authorization"]
      );
    } else {
      console.log("No Authorization header added (requiredToken: false)");
    }

    const usedDelete = () =>
      instance.delete(url, {
        headers: {
          Authorization: fullHeader["Authorization"],
          ...instance.defaults.headers,
          ...fullHeader,
        },
        data: { ...params },
      });
    return usedDelete();
  };

  // EDIT
  const UseEdit = ({
    url = "",
    params = {},
    headers = {},
    requiredToken = false,
  } = {}) => {
    let fullHeader = { ...headers };
    if (requiredToken) {
      const tokenData = getToken();
      console.log("Token data (UseEdit):", tokenData);
      const accessToken = tokenData?.access_token;
      const refreshToken = tokenData?.refresh_token;

      if (accessToken) {
        fullHeader["Authorization"] = `Bearer ${accessToken}`;
      } else if (refreshToken) {
        fullHeader["Authorization"] = `Bearer ${refreshToken}`;
      } else {
        console.error("No valid token found");
      }
      console.log(
        "Authorization header (UseEdit):",
        fullHeader["Authorization"]
      );
    } else {
      console.log("No Authorization header added (requiredToken: false)");
    }

    const usedEdit = () =>
      instance.put(
        url,
        { ...params },
        {
          headers: {
            Authorization: fullHeader["Authorization"],
            ...instance.defaults.headers,
            ...fullHeader,
          },
        }
      );
    return usedEdit();
  };

  // PATCH
  const UsePatch = ({
    url = "",
    params = {},
    headers = {},
    requiredToken = false,
  } = {}) => {
    let fullHeader = { ...headers };
    if (requiredToken) {
      const tokenData = getToken();
      console.log("Token data (UsePatch):", tokenData);
      const accessToken = tokenData?.access_token;
      const refreshToken = tokenData?.refresh_token;

      if (accessToken) {
        fullHeader["Authorization"] = `Bearer ${accessToken}`;
      } else if (refreshToken) {
        fullHeader["Authorization"] = `Bearer ${refreshToken}`;
      } else {
        console.error("No valid token found");
      }
      console.log(
        "Authorization header (UsePatch):",
        fullHeader["Authorization"]
      );
    } else {
      console.log("No Authorization header added (requiredToken: false)");
    }

    const usedPatch = () =>
      instance.patch(
        url,
        { ...params },
        {
          headers: {
            Authorization: fullHeader["Authorization"],
            ...instance.defaults.headers,
            ...fullHeader,
          },
        }
      );
    return usedPatch();
  };
  // POST FILE
  const UsePostFile = ({
    url = "",
    params = new FormData(), // Expect FormData for file uploads
    headers = {},
    requiredToken = false,
  } = {}) => {
    let fullHeader = { ...headers };
    if (requiredToken) {
      const tokenData = getToken();
      console.log("Token data (UsePostFile):", tokenData);
      const accessToken = tokenData?.access_token;
      const refreshToken = tokenData?.refresh_token;

      if (accessToken) {
        fullHeader["Authorization"] = `Bearer ${accessToken}`;
      } else if (refreshToken) {
        fullHeader["Authorization"] = `Bearer ${refreshToken}`;
      } else {
        console.error("No valid token found");
      }
      console.log(
        "Authorization header (UsePostFile):",
        fullHeader["Authorization"]
      );
    } else {
      console.log("No Authorization header added (requiredToken: false)");
    }

    const usedPost = () =>
      instanceFile.post(url, params, {
        headers: {
          // Do not set Content-Type; let browser set multipart/form-data with boundary
          Authorization: fullHeader["Authorization"],
          ...instanceFile.defaults.headers,
          ...fullHeader,
        },
      });
    return usedPost();
  };

  // POST GOOGLE
  const UsePostGoogle = ({
    url = "",
    params = {},
    headers = {},
    requiredToken = false,
  } = {}) => {
    let fullHeader = { ...headers };
    if (requiredToken) {
      const tokenData = getToken();
      console.log("Token data (UsePostGoogle):", tokenData);
      const accessToken = tokenData?.access_token;
      const refreshToken = tokenData?.refresh_token;

      if (accessToken) {
        fullHeader["Authorization"] = `Bearer ${accessToken}`;
      } else if (refreshToken) {
        fullHeader["Authorization"] = `Bearer ${refreshToken}`;
      } else {
        console.error("No valid token found");
      }
      console.log(
        "Authorization header (UsePostGoogle):",
        fullHeader["Authorization"]
      );
    } else {
      console.log("No Authorization header added (requiredToken: false)");
    }

    const usedPost = () =>
      instance.post(
        url,
        { ...params },
        {
          headers: {
            ...instance.defaults.headers,
            ...fullHeader,
          },
        }
      );
    return usedPost();
  };

    // POST
  const UsePut = ({
    url = "",
    params = {},
    headers = {},
    requiredToken = false,
  } = {}) => {
    let fullHeader = { ...headers };
    console.log("FUll Header", fullHeader);
    if (requiredToken) {
      const tokenData = getToken();
      console.log("Token data (UsePost):", tokenData);
      const accessToken = tokenData?.access_token;
      const refreshToken = tokenData?.refresh_token;

      if (accessToken) {
        fullHeader["Authorization"] = `Bearer ${accessToken}`;
      } else if (refreshToken) {
        fullHeader["Authorization"] = `Bearer ${refreshToken}`;
      } else {
        console.error("No valid token found");
      }
      console.log(
        "Authorization header (UsePost):",
        fullHeader["Authorization"]
      );
    } else {
      console.log("No Authorization header added (requiredToken: false)");
    }

    const usedPut = () =>
      instance.put(
        url,
        { ...params },
        {
          headers: {
            Authorization: fullHeader["Authorization"],
            ...instance.defaults.headers,
            ...fullHeader,
          },
        }
      );
    return usedPut();
  };
  return {
    UseGet,
    UsePost,
    UseDelete,
    UseEdit,
    UsePostFile,
    UsePostGoogle,
    UsePatch,
    UsePut
  };
}

export default UseCallApi;
