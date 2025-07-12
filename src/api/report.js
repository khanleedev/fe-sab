import UseCallApi from "../hooks/UseCallApi";

const { UseGet, UsePost, UseEdit, UsePostGoogle } = UseCallApi();

export const createReportApi = (params) => {
  const url = "/v1/reports";
  return UsePost({ url, requiredToken: true, params });
};

export const getListReportPendingApi = (params) => {
  const url = "/v1/reports/pending";
  return UseGet({ url, requiredToken: true, params });
};
export const getListReportResolvedApi = (params) => {
  const url = "/v1/reports/resolved";
  return UseGet({ url, requiredToken: true, params });
};
