import React from "react";
import { useState } from "react";
import {
  Table,
  Spin,
  DatePicker,
  Button,
  Card,
  Typography,
  Row,
  Col,
  Tag,
  Space,
  Empty,
  Statistic,
} from "antd";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import UseCookie from "../../hooks/UseCookie";
import { getMeApi } from "../../api/account";
import Header from "../../components/user/common/Header";
import {
  getOrderTransactionByIdApi,
  getPaymentByIdApi,
} from "../../api/paymentTransaction";
import dayjs from "dayjs";
import {
  HistoryOutlined,
  CalendarOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CreditCardOutlined,
  ShoppingCartOutlined,
  DownloadOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

const DepositHistory = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getToken } = UseCookie();
  const tokenData = getToken();

  // Fetch user data
  const {
    data: userData,
    isLoading: isLoadingUser,
    error: userError,
  } = useQuery({
    queryKey: ["userData"],
    queryFn: () =>
      getMeApi({}).then((res) => {
        return res.data;
      }),
    onError: (err) => {
      const errorMessage =
        err.response?.data?.message || t("failed_fetch_user");
      toast.error(errorMessage);
      if (err.response?.status === 401) {
        navigate("/login");
      }
    },
    enabled: !!tokenData,
  });

  // Fetch payment transactions
  const {
    data: paymentResponse,
    isLoading: isLoadingPayments,
    error: paymentsError,
    refetch: refetchPayments,
  } = useQuery({
    queryKey: ["payments", userData],
    queryFn: () =>
      getPaymentByIdApi({ accountId: userData?.id }).then((res) => {
        return res.data;
      }),
    onError: (err) => {
      const errorMessage =
        err.response?.data?.message || t("failed_fetch_payments");
      toast.error(errorMessage);
    },
    enabled: !!userData,
  });

  // Fetch order transactions
  const {
    data: orderTransactionResponse,
    isLoading: isLoadingOrderTransactions,
    error: orderTransactionsError,
    refetch: refetchOrderTransactions,
  } = useQuery({
    queryKey: ["orderTransactions", userData],
    queryFn: () =>
      getOrderTransactionByIdApi({ accountId: userData?.id }).then((res) => {
        return res.data;
      }),
    onError: (err) => {
      const errorMessage =
        err.response?.data?.message || t("failed_fetch_orders");
      toast.error(errorMessage);
    },
    enabled: !!userData,
  });

  const payments = paymentResponse?.content || [];
  const orderTransactions = orderTransactionResponse?.content || [];

  // Combine payments and order transactions
  const combinedTransactions = [...payments, ...orderTransactions].sort(
    (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
  );

  const [dateRange, setDateRange] = useState([null, null]);

  // Filter transactions based on date range
  const filteredTransactions = combinedTransactions.filter((transaction) => {
    if (!dateRange[0] || !dateRange[1]) return true;
    const transactionDate = dayjs(transaction.createdDate);
    return transactionDate.isBetween(dateRange[0], dateRange[1], null, "[]");
  });

  // Calculate statistics
  const totalTransactions = filteredTransactions.length;
  const completedTransactions = filteredTransactions.filter(
    (t) => t.status === 1
  ).length;
  const totalAmount = filteredTransactions.reduce((sum, transaction) => {
    const amount = transaction.amountInCoin || transaction.amountInCash || 0;
    return (
      sum +
      (typeof amount === "number" ? amount : Number.parseFloat(amount) || 0)
    );
  }, 0);

  const handleRefresh = () => {
    refetchPayments();
    refetchOrderTransactions();
    toast.success(t("data_refreshed"));
  };

  const handleClearFilter = () => {
    setDateRange([null, null]);
  };

  const getStatusTag = (status) => {
    if (status === 1) {
      return (
        <Tag icon={<CheckCircleOutlined />} color="success">
          {t("completed")}
        </Tag>
      );
    } else {
      return (
        <Tag icon={<ClockCircleOutlined />} color="warning">
          {t("pending")}
        </Tag>
      );
    }
  };

  const getTypeTag = (record) => {
    if (payments.includes(record)) {
      return (
        <Tag icon={<CreditCardOutlined />} color="blue">
          {t("payment")}
        </Tag>
      );
    } else {
      return (
        <Tag icon={<ShoppingCartOutlined />} color="purple">
          {t("order")}
        </Tag>
      );
    }
  };

  const columns = [
    {
      title: t("date_time"),
      dataIndex: "createdDate",
      key: "createdDate",
      width: 180,
      render: (text) => (
        <div>
          <div className="font-medium text-gray-900">
            {dayjs(text).format("DD/MM/YYYY")}
          </div>
          <div className="text-sm text-gray-500">
            {dayjs(text).format("HH:mm:ss")}
          </div>
        </div>
      ),
      sorter: (a, b) => new Date(a.createdDate) - new Date(b.createdDate),
    },
    {
      title: t("transaction_type"),
      dataIndex: "type",
      key: "type",
      width: 150,
      render: (_, record) => getTypeTag(record),
      filters: [
        { text: t("payment"), value: "payment" },
        { text: t("order"), value: "order" },
      ],
      onFilter: (value, record) => {
        if (value === "payment") return payments.includes(record);
        if (value === "order") return orderTransactions.includes(record);
        return true;
      },
    },
    {
      title: t("amount"),
      key: "amount",
      width: 150,
      render: (_, record) => {
        let amount = 0;
        let unit = "";

        if (record.amountInCoin !== undefined && record.amountInCoin !== null) {
          amount = record.amountInCoin;
          unit = "coins";
        } else if (
          record.amountInCash !== undefined &&
          record.amountInCash !== null
        ) {
          amount = record.amountInCash;
          unit = "VND";
        }

        if (amount === 0) return <Text type="secondary">N/A</Text>;

        return (
          <div className="text-right">
            <div className="font-semibold text-green-600">
              {new Intl.NumberFormat("en-US").format(amount)} {unit}
            </div>
          </div>
        );
      },
      sorter: (a, b) => {
        const amountA = a.amountInCoin || a.amountInCash || 0;
        const amountB = b.amountInCoin || b.amountInCash || 0;
        return amountA - amountB;
      },
    },
    {
      title: t("status"),
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => getStatusTag(status),
      filters: [
        { text: t("completed"), value: 1 },
        { text: t("pending"), value: 0 },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: t("transaction_id"),
      dataIndex: "id",
      key: "id",
      width: 120,
      render: (id) => (
        <Text code className="text-xs">
          #{id}
        </Text>
      ),
    },
  ];

  const isLoading =
    isLoadingUser || isLoadingPayments || isLoadingOrderTransactions;
  const hasError = userError || paymentsError || orderTransactionsError;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />

      <div className="max-w-7xl mx-auto p-6 sm:p-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <HistoryOutlined className="text-blue-600 text-xl" />
            </div>
            <div>
              <Title
                level={1}
                className="text-4xl font-bold text-gray-900 mb-1"
              >
                {t("transaction_history")}
              </Title>
              <Text className="text-lg text-gray-600">
                {t("view_manage_transactions")}
              </Text>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <Spin size="large" />
              <p className="mt-4 text-gray-600 text-lg">
                {t("loading_history")}
              </p>
            </div>
          </div>
        ) : hasError ? (
          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HistoryOutlined className="text-red-500 text-2xl" />
              </div>
              <Title level={3} className="text-gray-900 mb-2">
                {t("error_loading_history")}
              </Title>
              <Text className="text-gray-600 mb-6">
                {t("couldnt_load_history")}
              </Text>
              <Button
                type="primary"
                onClick={handleRefresh}
                icon={<ReloadOutlined />}
              >
                {t("try_again")}
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Statistics Cards */}
            <Row gutter={[24, 24]} className="mb-8">
              <Col xs={24} sm={8}>
                <Card className="shadow-lg border-0 rounded-2xl">
                  <Statistic
                    title={
                      <span className="text-gray-600 flex items-center gap-2">
                        {t("total_transactions")}
                      </span>
                    }
                    value={totalTransactions}
                    valueStyle={{
                      color: "#1890ff",
                      fontSize: "2rem",
                      fontWeight: "bold",
                    }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card className="shadow-lg border-0 rounded-2xl">
                  <Statistic
                    title={
                      <span className="text-gray-600 flex items-center gap-2">
                        <CheckCircleOutlined className="text-green-600" />
                        {t("completed")}
                      </span>
                    }
                    value={completedTransactions}
                    valueStyle={{
                      color: "#52c41a",
                      fontSize: "2rem",
                      fontWeight: "bold",
                    }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card className="shadow-lg border-0 rounded-2xl">
                  <Statistic
                    title={
                      <span className="text-gray-600 flex items-center gap-2">
                        <DollarOutlined className="text-purple-600" />
                        {t("total_amount")}
                      </span>
                    }
                    value={totalAmount}
                    precision={0}
                    valueStyle={{
                      color: "#722ed1",
                      fontSize: "2rem",
                      fontWeight: "bold",
                    }}
                    formatter={(value) =>
                      `${new Intl.NumberFormat("en-US").format(value)}`
                    }
                  />
                </Card>
              </Col>
            </Row>

            {/* Filters and Actions */}
            <Card className="shadow-lg border-0 rounded-2xl mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <CalendarOutlined className="text-blue-600" />
                    <Text strong>{t("filter_by_date")}:</Text>
                  </div>
                  <RangePicker
                    value={dateRange}
                    onChange={setDateRange}
                    format="DD/MM/YYYY"
                    placeholder={[t("start_date"), t("end_date")]}
                    className="rounded-lg"
                  />
                  {(dateRange[0] || dateRange[1]) && (
                    <Button
                      onClick={handleClearFilter}
                      type="link"
                      className="text-blue-600"
                    >
                      {t("clear_filter")}
                    </Button>
                  )}
                </div>

                <Space>
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={handleRefresh}
                    className="rounded-lg"
                  >
                    {t("refresh")}
                  </Button>
                  <Button
                    type="primary"
                    icon={<DownloadOutlined />}
                    className="bg-blue-600 hover:bg-blue-700 rounded-lg"
                  >
                    {t("export")}
                  </Button>
                </Space>
              </div>
            </Card>

            {/* Transactions Table */}
            <Card className="shadow-lg border-0 rounded-2xl">
              {filteredTransactions.length > 0 ? (
                <Table
                  columns={columns}
                  dataSource={filteredTransactions}
                  rowKey="id"
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) =>
                      `${range[0]}-${range[1]} of ${total} ${t("transactions")}`,
                    className: "mt-4",
                  }}
                  className="rounded-lg"
                  scroll={{ x: 800 }}
                  rowClassName="hover:bg-blue-50 transition-colors"
                />
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <div className="text-center py-8">
                      <Title level={4} className="text-gray-500 mb-2">
                        {t("no_transactions_found")}
                      </Title>
                      <Text className="text-gray-400">
                        {dateRange[0] || dateRange[1]
                          ? t("no_transactions_range")
                          : t("no_transactions_yet")}
                      </Text>
                      {!(dateRange[0] || dateRange[1]) && (
                        <div className="mt-6">
                          <Button
                            type="primary"
                            size="large"
                            onClick={() => navigate("/deposit")}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            {t("make_first_deposit")}
                          </Button>
                        </div>
                      )}
                    </div>
                  }
                />
              )}
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default DepositHistory;