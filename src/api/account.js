import UseCallApi from "../hooks/UseCallApi";

const { UseGet, UsePost, UseEdit, UsePostGoogle, UsePatch } = UseCallApi();

export const SignUpApi = (params) => {
  const url = "v1/accounts/users/register";
  return UsePost({ url, params });
};

export const SendOTPEmailApi = (params) => {
  const url = "v1/otps/send-otp-email";
  return UsePost({ url, params });
};

export const VerifyOTPEmailApi = (params) => {
  const url = "v1/otps/verify-otp";
  return UsePost({ url, params });
};
export const resetPasswordApi = (params) => {
  const url = "v1/auth/reset-password";
  return UsePost({ url, params });
};
export const confirmResetPasswordApi = (params) => {
  const url = "/v1/auth/reset-password/confirm";
  return UsePost({ url, params });
};
export const authLoginApi = (params) => {
  const url = "/v1/auth/login";

  return UsePost({ url, params, type: "basicAuth" });
};

export const getMeApi = (params) => {
  const url = "/v1/accounts/get-me";
  return UseGet({ url, requiredToken: true, params });
};
export const getUserByIdApi = (key, id) => {
  const url = `/v1/accounts/${id}`;
  return UseGet({ url, requiredToken: true });
};

export const getListAccountsApi = (params) => {
  const url = "/v1/accounts";
  return UseGet({ url, requiredToken: true, params });
};

export const updateAccountApi = (params) => {
  const url = "/v1/accounts";
  return UsePatch({ url, requiredToken: true, params });
};
