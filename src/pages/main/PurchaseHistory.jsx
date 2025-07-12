import React from "react";
import { useState } from "react";
import {
  Table,
  Spin,
  Input,
  Button,
  Card,
  Typography,
  Row,
  Col,
  Tag,
  Space,
  Empty,
  Statistic,
  Avatar,
} from "antd";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import UseCookie from "../../hooks/UseCookie";
import { getMeApi } from "../../api/account";
import Header from "../../components/user/common/Header";
import { getOrderByIdApi } from "../../api/ticketproduct";
import {
  ShoppingCartOutlined,
  SearchOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ReloadOutlined,
  DownloadOutlined,
  ClearOutlined,
  TagOutlined,
  NumberOutlined,
  ShoppingOutlined,
  FacebookOutlined,
  GoogleOutlined,
  InstagramOutlined,
  TwitterOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

const { Search } = Input;
const { Title, Text } = Typography;

const PurchaseHistory = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getToken } = UseCookie();
  const tokenData = getToken();

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

  const {
    data: ordersResponse,
    isLoading: isLoadingOrders,
    error: ordersError,
    refetch: refetchOrders,
  } = useQuery({
    queryKey: ["orders", userData],
    queryFn: () =>
      getOrderByIdApi(userData?.id).then((res) => {
        return res.data;
      }),
    onError: (err) => {
      const errorMessage = err.response?.data?.message || t("failed_fetch_orders");
      toast.error(errorMessage);
    },
    enabled: !!userData,
  });

  const orders = ordersResponse?.content || [];
  const [searchProductName, setSearchProductName] = useState("");

  const filteredOrders = orders.filter((order) => {
    const matchesProductName =
      !searchProductName ||
      order.ticketProduct?.name
        ?.toLowerCase()
        ?.includes(searchProductName.toLowerCase());
    return matchesProductName;
  });

  // Calculate statistics
  const totalOrders = filteredOrders.length;
  const completedOrders = filteredOrders.filter(
    (order) => order.status === 1
  ).length;
  const totalSpent = filteredOrders.reduce(
    (sum, order) => sum + (order.totalPrice || 0),
    0
  );
  const totalQuantity = filteredOrders.reduce(
    (sum, order) => sum + (order.quantity || 0),
    0
  );

  const handleRefresh = () => {
    refetchOrders();
    toast.success(t("data_refreshed"));
  };

  const handleReset = () => {
    setSearchProductName("");
  };

  const getPlatformIcon = (productName) => {
    if (!productName) return <ShoppingOutlined className="text-gray-500" />;

    const name = productName.toLowerCase();
    if (name.includes("facebook"))
      return <FacebookOutlined className="text-blue-600" />;
    if (name.includes("google"))
      return <GoogleOutlined className="text-red-500" />;
    if (name.includes("instagram"))
      return <InstagramOutlined className="text-pink-500" />;
    if (name.includes("twitter"))
      return <TwitterOutlined className="text-blue-400" />;
    return <ShoppingOutlined className="text-purple-500" />;
  };

  const getStatusTag = (status) => {
    if (status === 1) {
      return (
        <Tag
          icon={<CheckCircleOutlined />}
          color="success"
          className="rounded-full"
        >
          {t("completed_orders")}
        </Tag>
      );
    } else {
      return (
        <Tag
          icon={<ClockCircleOutlined />}
          color="warning"
          className="rounded-full"
        >
          {t("pending")}
        </Tag>
      );
    }
  };

  const columns = [
    {
      title: t("order_details"),
      key: "orderDetails",
      width: 300,
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar
            size={48}
            icon={getPlatformIcon(record.ticketProduct?.name)}
            className="bg-gray-100 flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-gray-900 truncate">
              {record.ticketProduct?.name || "N/A"}
            </div>
            <div className="text-sm text-gray-500">{t("order")} #{record.id}</div>
            <div className="text-xs text-gray-400">
              {dayjs(record.createdDate).format("DD/MM/YYYY HH:mm")}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: t("product_info"),
      key: "productInfo",
      width: 200,
      render: (_, record) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <TagOutlined className="text-blue-500 text-xs" />
            <Text className="text-sm font-medium">
              {record.ticketProduct?.price || 0} {t("coins")}
            </Text>
          </div>
          <div className="flex items-center gap-2">
            <NumberOutlined className="text-green-500 text-xs" />
            <Text className="text-sm">
              {t("code")}: {record.ticketProduct?.itemCode || "N/A"}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: t("quantity"),
      dataIndex: "quantity",
      key: "quantity",
      width: 100,
      align: "center",
      render: (quantity) => (
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
            <Text strong className="text-blue-600">
              {quantity || 0}
            </Text>
          </div>
        </div>
      ),
      sorter: (a, b) => (a.quantity || 0) - (b.quantity || 0),
    },
    {
      title: t("total_amount"),
      dataIndex: "totalPrice",
      key: "totalPrice",
      width: 150,
      align: "right",
      render: (totalPrice) => (
        <div className="text-right">
          <div className="font-bold text-lg text-green-600">
            {new Intl.NumberFormat("en-US").format(totalPrice || 0)}
          </div>
          <div className="text-sm text-gray-500">{t("coins")}</div>
        </div>
      ),
      sorter: (a, b) => (a.totalPrice || 0) - (b.totalPrice || 0),
    },
    {
      title: t("status"),
      dataIndex: "status",
      key: "status",
      width: 120,
      align: "center",
      render: (status) => getStatusTag(status),
      filters: [
        { text: t("completed_orders"), value: 1 },
        { text: t("pending"), value: 0 },
      ],
      onFilter: (value, record) => record.status === value,
    },
  ];

  const isLoading = isLoadingUser || isLoadingOrders;
  const hasError = userError || ordersError;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />

      <div className="max-w-7xl mx-auto p-6 sm:p-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div>
              <Title
                level={1}
                className="text-4xl font-bold text-gray-900 mb-1"
              >
                {t("purchase_history")}
              </Title>
              <Text className="text-lg text-gray-600">
                {t("track_manage_purchases")}
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
                <ShoppingCartOutlined className="text-red-500 text-2xl" />
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
              <Col xs={24} sm={6}>
                <Card className="shadow-lg border-0 rounded-2xl">
                  <Statistic
                    title={
                      <span className="text-gray-600 flex items-center gap-2">
                        <ShoppingCartOutlined className="text-purple-600" />
                        {t("total_orders")}
                      </span>
                    }
                    value={totalOrders}
                    valueStyle={{
                      color: "#722ed1",
                      fontSize: "2rem",
                      fontWeight: "bold",
                    }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={6}>
                <Card className="shadow-lg border-0 rounded-2xl">
                  <Statistic
                    title={
                      <span className="text-gray-600 flex items-center gap-2">
                        <CheckCircleOutlined className="text-green-600" />
                        {t("completed_orders")}
                      </span>
                    }
                    value={completedOrders}
                    valueStyle={{
                      color: "#52c41a",
                      fontSize: "2rem",
                      fontWeight: "bold",
                    }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={6}>
                <Card className="shadow-lg border-0 rounded-2xl">
                  <Statistic
                    title={
                      <span className="text-gray-600 flex items-center gap-2">
                        <DollarOutlined className="text-blue-600" />
                        {t("total_spent")}
                      </span>
                    }
                    value={totalSpent}
                    precision={0}
                    valueStyle={{
                      color: "#1890ff",
                      fontSize: "2rem",
                      fontWeight: "bold",
                    }}
                    formatter={(value) =>
                      `${new Intl.NumberFormat("en-US").format(value)}`
                    }
                    suffix={t("coins")}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={6}>
                <Card className="shadow-lg border-0 rounded-2xl">
                  <Statistic
                    title={
                      <span className="text-gray-600 flex items-center gap-2">
                        {t("total_items")}
                      </span>
                    }
                    value={totalQuantity}
                    valueStyle={{
                      color: "#fa8c16",
                      fontSize: "2rem",
                      fontWeight: "bold",
                    }}
                  />
                </Card>
              </Col>
            </Row>

            {/* Search and Actions */}
            <Card className="shadow-lg border-0 rounded-2xl mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex items-center gap-2">
                    <SearchOutlined className="text-blue-600" />
                    <Text strong>{t("search_products")}:</Text>
                  </div>
                  <Search
                    placeholder={t("search_by_product_name")}
                    value={searchProductName}
                    onChange={(e) => setSearchProductName(e.target.value)}
                    className="max-w-md"
                    size="large"
                    allowClear
                  />
                  {searchProductName && (
                    <Button
                      icon={<ClearOutlined />}
                      onClick={handleReset}
                      className="rounded-lg"
                      title={t("reset")}
                    >
                      {t("reset")}
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

            {/* Orders Table */}
            <Card className="shadow-lg border-0 rounded-2xl">
              {filteredOrders.length > 0 ? (
                <Table
                  columns={columns}
                  dataSource={filteredOrders}
                  rowKey="id"
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) =>
                      `${range[0]}-${range[1]} of ${total} ${t("orders")}`,
                    className: "mt-4",
                  }}
                  className="rounded-lg"
                  scroll={{ x: 1000 }}
                  rowClassName="hover:bg-blue-50 transition-colors"
                />
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <div className="text-center py-8">
                      <Title level={4} className="text-gray-500 mb-2">
                        {t("no_orders_found")}
                      </Title>
                      <Text className="text-gray-400">
                        {searchProductName
                          ? t("no_orders_match", { searchTerm: searchProductName })
                          : t("no_purchases_yet")}
                      </Text>
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

export default PurchaseHistory;