import UseCallApi from "../hooks/UseCallApi";

const { UseGet, UsePost } = UseCallApi();

// Tạo giao dịch nạp tiền qua /v1/transactions/payment
export const createTransactionForPaymentApi = (params) => {
  const url = "/v1/transactions/payment";
  return UsePost({ url, requiredToken: true, params });
};

// Lấy danh sách các giao dịch thanh toán
export const getListPaymentTransactionsApi = (params) => {
  const url = "/v1/payment-transactions";
  return UseGet({ url, requiredToken: true, params });
};

// Lấy thông tin giao dịch thanh toán theo ID
export const getPaymentTransactionByIdApi = (key, id) => {
  const url = `/v1/payment-transactions/${id}`;
  return UseGet({ url, requiredToken: true });
};

export const getPaymentByIdApi = (params) => {
  const url = `/v1/transactions/payment/account`;
  return UseGet({ url, requiredToken: true, params });
};

export const getOrderTransactionByIdApi = (params) => {
  const url = `/v1/transactions/order/account`;
  return UseGet({ url, requiredToken: true, params });
};