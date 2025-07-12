import React from "react";
import { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Select,
  Button,
  Modal,
  InputNumber,
  Typography,
  Space,
  Tag,
  Spin,
  Empty,
  Badge,
  Statistic,
  Alert,
  Divider,
} from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createOrderApi,
  getTicketProductByIdApi,
} from "../../api/ticketproduct";
import { getMeApi, getUserByIdApi } from "../../api/account";
import UseCookie from "../../hooks/UseCookie";
import { useNavigate, useLocation, useParams } from "react-router";
import { toast } from "react-toastify";
import {
  ShoppingCartOutlined,
  ProductOutlined,
  DollarOutlined,
  FilterOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  FacebookOutlined,
  GoogleOutlined,
  InstagramOutlined,
  TwitterOutlined,
  CrownOutlined,
  FireOutlined,
  StarOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import Header from "./common/Header";

const { Option } = Select;
const { Title, Text, Paragraph } = Typography;

const TicketProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { removeToken, getToken } = UseCookie();
  const queryClient = useQueryClient();
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [priceFilter, setPriceFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const tokenData = getToken();
  const { ticketId } = useParams();
  const id = ticketId;
  // Extract ticketId from URL query parameters
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const ticketId = queryParams.get("ticketId");
    if (ticketId) {
      setSelectedTicketId(ticketId);
    }
  }, [location.search]);

  // First query: Fetch user data from getMeApi
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
        err.response?.data?.message || "Failed to fetch user data";
      toast.error(errorMessage);
      if (err.response?.status === 401) {
        navigate("/");
      }
    },
    enabled: !!tokenData,
  });

  const {
    data: detailedUserData,
    isLoading: isLoadingDetailedUser,
    error: detailedUserError,
  } = useQuery({
    queryKey: ["detailedUserData", userData?.id],
    queryFn: () =>
      getUserByIdApi("user", userData?.id).then((res) => {
        return res.data;
      }),
    onError: (err) => {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch detailed user data";
      toast.error(errorMessage);
    },
    enabled: !!userData,
  });

  
  // Fetch ticket products
  const {
    data: listTicketProducts,
    isLoading: isLoadingTicketProducts,
    error,
  } = useQuery({
    queryKey: ["listTicketProducts", id],
    queryFn: () =>
      getTicketProductByIdApi(id).then((res) => {
        return res.data.content || res.data;
      }),
    onError: (err) => {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch ticket products";
      toast.error(errorMessage);
      if (err.response?.status === 401) {
        removeToken();
        navigate("/login");
      }
    },
  });

  // Mutation to create an order
  const { mutate: createOrder, isLoading: isCreatingOrder } = useMutation({
    mutationFn: createOrderApi,
    onSuccess: (response) => {
      toast.success("Order created successfully!");
      queryClient.invalidateQueries(["detailedUserData"]);
      queryClient.invalidateQueries(["orders"]);
      setIsModalVisible(false);
      setQuantity(1);
      setSelectedProduct(null);
      const dataList = response?.data;
      if (Array.isArray(dataList) && dataList.length > 0) {
        downloadOrderTextFile(dataList);
      }
    },
    onError: (err) => {
      const errorMessage =
        err.response?.data?.message || "Failed to create order";
      toast.error(errorMessage);
      if (err.response?.status === 401) {
        removeToken();
        navigate("/login");
      }
    },
  });

  const downloadOrderTextFile = (orderList = []) => {
    const header = "UID | PASS | 2FA | MAIL | PASS MAIL | MAIL VERIFY";
    const lines = orderList.map((item) => {
      const uid = item.uid || "";
      const pass = item.pass || "";
      const twoFA = item.twoFA || "";
      const mail = item.mail || "";
      const passMail = item.passMail || "";
      const mailVerify = item.mailVerify || "";
  
      return `${uid} | ${pass} | ${twoFA} | ${mail} | ${passMail} | ${mailVerify}`;
    });
  
    const content = [header, ...lines].join("\n");
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
  
    const link = document.createElement("a");
    link.href = url;
    link.download = "order.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
 
  // Handle opening the modal and setting the selected product
  const handleOpenModal = (ticketProduct) => {
    setSelectedProduct(ticketProduct);
    setQuantity(1);
    setIsModalVisible(true);
  };

  // Handle closing the modal
  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedProduct(null);
    setQuantity(1);
  };

  // Handle Buy confirmation in the modal
  const handleConfirmBuy = () => {
    if (!detailedUserData?.id) {
      toast.error("User data not available. Please try again.");
      return;
    }

    if (!selectedProduct) {
      toast.error("No product selected. Please try again.");
      return;
    }

    const totalCost = quantity * selectedProduct.price;
    if (detailedUserData.balance < totalCost) {
      toast.error("Insufficient balance. Please add funds to your account.");
      return;
    }

    const payload = {
      ticketProductId: selectedProduct.id,
      accountId: detailedUserData.id,
      quantity: quantity,
    };

    createOrder(payload);
  };

  // Get platform icon based on product name
  const getPlatformIcon = (productName) => {
    if (!productName) return <ProductOutlined className="text-gray-500" />;

    const name = productName.toLowerCase();
    if (name.includes("facebook"))
      return <FacebookOutlined className="text-blue-600" />;
    if (name.includes("google"))
      return <GoogleOutlined className="text-red-500" />;
    if (name.includes("instagram"))
      return <InstagramOutlined className="text-pink-500" />;
    if (name.includes("twitter"))
      return <TwitterOutlined className="text-blue-400" />;
    return <ProductOutlined className="text-purple-500" />;
  };

  // Get product badge based on criteria
  const getProductBadge = (product) => {
    if (product.quantity < 5) {
      return <Badge.Ribbon text="Limited Stock" color="red" />;
    }
    if (product.price < 50) {
      return <Badge.Ribbon text="Best Value" color="green" />;
    }
    if (product.quantity > 100) {
      return <Badge.Ribbon text="Popular" color="blue" />;
    }
    return null;
  };

  // Filter and sort products
  const getFilteredAndSortedProducts = () => {
    let filtered = selectedTicketId
      ? listTicketProducts?.filter(
          (ticketProduct) => ticketProduct.ticketId === selectedTicketId
        )
      : listTicketProducts;

    // Apply price filter
    if (priceFilter !== "all") {
      filtered = filtered?.filter((product) => {
        if (priceFilter === "low") return product.price < 50;
        if (priceFilter === "medium")
          return product.price >= 50 && product.price < 100;
        if (priceFilter === "high") return product.price >= 100;
        return true;
      });
    }

    // Apply sorting
    if (filtered) {
      filtered = [...filtered].sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        if (sortBy === "quantity") return b.quantity - a.quantity;
        return a.name.localeCompare(b.name);
      });
    }

    return filtered || [];
  };

  const filteredTicketProducts = getFilteredAndSortedProducts();

  const formatBalance = (balance) => {
    if (!balance) return "0";
    return new Intl.NumberFormat("en-US").format(balance);
  };

  const isLoading =
    isLoadingTicketProducts || isLoadingUser || isLoadingDetailedUser;
  const hasError = error || userError || detailedUserError;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />

      <div className="max-w-7xl mx-auto p-6 sm:p-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
            <ShoppingCartOutlined className="text-purple-600 text-2xl" />
          </div>
          <Title level={1} className="text-4xl font-bold text-gray-900 mb-2">
            Premium Ad Accounts Marketplace
          </Title>
          <Paragraph className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover high-quality advertising accounts for all major platforms.
            Boost your marketing campaigns with verified, premium accounts.
          </Paragraph>
        </div>

        {/* User Balance Card */}
        {detailedUserData && (
          <Card className="shadow-lg border-0 rounded-2xl mb-8 bg-gradient-to-r from-green-50 to-emerald-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <WalletOutlined className="text-green-600 text-xl" />
                </div>
                <div>
                  <Text className="text-green-600 font-medium">
                    Your Balance
                  </Text>
                  <div className="text-2xl font-bold text-green-700">
                    {formatBalance(detailedUserData.balance)} coins
                  </div>
                </div>
              </div>
              <Button
                type="primary"
                onClick={() => navigate("/deposit")}
                className="bg-green-600 hover:bg-green-700"
                icon={<DollarOutlined />}
              >
                Add Funds
              </Button>
            </div>
          </Card>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <Spin size="large" />
              <p className="mt-4 text-gray-600 text-lg">
                Loading marketplace...
              </p>
            </div>
          </div>
        ) : hasError ? (
          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ExclamationCircleOutlined className="text-red-500 text-2xl" />
              </div>
              <Title level={3} className="text-gray-900 mb-2">
                Error Loading Products
              </Title>
              <Text className="text-gray-600 mb-6">
                We couldn't load the marketplace. Please try again.
              </Text>
              <Button type="primary" onClick={() => window.location.reload()}>
                Retry
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Filters and Controls */}
            <Card className="shadow-lg border-0 rounded-2xl mb-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <FilterOutlined className="text-blue-600" />
                    <Text strong>Filters:</Text>
                  </div>

                  <Select
                    placeholder="Price Range"
                    value={priceFilter}
                    onChange={setPriceFilter}
                    className="min-w-32"
                  >
                    <Option value="all">All Prices</Option>
                    <Option value="low">Under 50 coins</Option>
                    <Option value="medium">50-100 coins</Option>
                    <Option value="high">100+ coins</Option>
                  </Select>

                  <Select
                    placeholder="Sort By"
                    value={sortBy}
                    onChange={setSortBy}
                    className="min-w-32"
                  >
                    <Option value="name">Name A-Z</Option>
                    <Option value="price-low">Price: Low to High</Option>
                    <Option value="price-high">Price: High to Low</Option>
                    <Option value="quantity">Most Available</Option>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Text className="text-gray-600">
                    {filteredTicketProducts.length} product
                    {filteredTicketProducts.length !== 1 ? "s" : ""} found
                  </Text>
                </div>
              </div>
            </Card>

            {/* Products Grid */}
            {filteredTicketProducts.length === 0 ? (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <div className="text-center py-8">
                    <Title level={4} className="text-gray-500 mb-2">
                      No Products Found
                    </Title>
                    <Text className="text-gray-400">
                      {selectedTicketId
                        ? "No products available for the selected ticket."
                        : "Try adjusting your filters or check back later for new products."}
                    </Text>
                  </div>
                }
              />
            ) : (
              <Row gutter={[24, 24]}>
                {filteredTicketProducts.map((ticketProduct, index) => {
                  const isOutOfStock = ticketProduct.quantity < 1;
                  const isLowStock =
                    ticketProduct.quantity < 5 && ticketProduct.quantity > 0;

                  return (
                    <Col xs={24} sm={12} md={8} lg={6} key={index}>
                      <div className="relative">
                        {getProductBadge(ticketProduct)}
                        <Card
                          hoverable={!isOutOfStock}
                          className={`h-full transition-all duration-300 ${
                            isOutOfStock
                              ? "opacity-60 cursor-not-allowed"
                              : "hover:shadow-xl hover:-translate-y-2 cursor-pointer"
                          } border-0 shadow-lg rounded-2xl overflow-hidden`}
                          onClick={() =>
                            !isOutOfStock && handleOpenModal(ticketProduct)
                          }
                        >
                          {/* Product Header */}
                          <div className="h-[250px] bg-gradient-to-r from-blue-50 to-purple-50 -m-6 mb-4 p-6 text-center">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                              {getPlatformIcon(ticketProduct.name)}
                            </div>
                            <Title
                              level={4}
                              className="mb-1 text-gray-900 line-clamp-3"
                            >
                              {ticketProduct.name}
                            </Title>
                          </div>

                          {/* Product Details */}
                          <div className="space-y-4">
                            {/* Price */}
                            <div className="text-center">
                              <div className="text-2xl font-bold text-green-600 mb-1">
                                {ticketProduct.price} coins
                              </div>
                              <Text className="text-gray-500">per account</Text>
                            </div>

                            {/* Stock Status */}
                            <div className="flex items-center justify-center gap-2">
                              {isOutOfStock ? (
                                <Tag
                                  color="red"
                                  icon={<ExclamationCircleOutlined />}
                                >
                                  Out of Stock
                                </Tag>
                              ) : isLowStock ? (
                                <Tag color="orange" icon={<FireOutlined />}>
                                  Only {ticketProduct.quantity} left
                                </Tag>
                              ) : (
                                <Tag
                                  color="green"
                                  icon={<CheckCircleOutlined />}
                                >
                                  {ticketProduct.quantity} available
                                </Tag>
                              )}
                            </div>

                            {/* Features */}
                            <div className="space-y-2 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <CheckCircleOutlined className="text-green-500" />
                                <span>Verified Account</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <StarOutlined className="text-yellow-500" />
                                <span>Premium Quality</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <CrownOutlined className="text-purple-500" />
                                <span>Instant Delivery</span>
                              </div>
                            </div>

                            {/* Buy Button */}
                            <Button
                              type="primary"
                              block
                              size="large"
                              disabled={isOutOfStock}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenModal(ticketProduct);
                              }}
                              className={`mt-4 h-12 font-semibold rounded-lg ${
                                isOutOfStock
                                  ? "bg-gray-400"
                                  : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-none"
                              }`}
                              icon={<ShoppingCartOutlined />}
                            >
                              {isOutOfStock ? "Out of Stock" : "Purchase Now"}
                            </Button>
                          </div>
                        </Card>
                      </div>
                    </Col>
                  );
                })}
              </Row>
            )}
          </>
        )}

        {/* Purchase Modal */}
        <Modal
          title={
            <div className="flex items-center gap-3">
              {getPlatformIcon(selectedProduct?.name)}
              <div>
                <div className="font-semibold text-lg">
                  {selectedProduct?.name}
                </div>
                <div className="text-sm text-gray-500">
                  Purchase Confirmation
                </div>
              </div>
            </div>
          }
          open={isModalVisible}
          onOk={handleConfirmBuy}
          onCancel={handleCancel}
          okText="Complete Purchase"
          okButtonProps={{
            loading: isCreatingOrder,
            className: "bg-blue-600 hover:bg-blue-700",
            size: "large",
          }}
          cancelButtonProps={{ disabled: isCreatingOrder, size: "large" }}
          width={600}
          className="rounded-2xl"
        >
          <div className="space-y-6 py-4">
            {/* Product Info */}
            <div className="bg-gray-50 rounded-xl p-4">
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Statistic
                    title="Price per Account"
                    value={selectedProduct?.price}
                    suffix="coins"
                    valueStyle={{ color: "#52c41a", fontSize: "1.5rem" }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Available Stock"
                    value={selectedProduct?.quantity}
                    valueStyle={{ color: "#1890ff", fontSize: "1.5rem" }}
                  />
                </Col>
              </Row>
            </div>

            {/* Quantity Selection */}
            <div>
              <Text strong className="block mb-2">
                Quantity to Purchase:
              </Text>
              <InputNumber
                min={1}
                max={selectedProduct?.quantity || 1}
                value={quantity}
                onChange={(value) => setQuantity(value)}
                size="large"
                className="w-full"
                addonAfter="accounts"
              />
            </div>

            {/* Order Summary */}
            {quantity > 0 && selectedProduct?.price && (
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <Title level={5} className="mb-3 text-blue-900">
                  Order Summary
                </Title>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Unit Price:</span>
                    <span className="font-medium">
                      {selectedProduct.price} coins
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quantity:</span>
                    <span className="font-medium">{quantity}</span>
                  </div>
                  <Divider className="my-2" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Cost:</span>
                    <span className="text-green-600">
                      {(quantity * selectedProduct.price).toFixed(0)} coins
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Balance Check */}
            {detailedUserData && quantity > 0 && selectedProduct?.price && (
              <Alert
                message={
                  detailedUserData.balance >= quantity * selectedProduct.price
                    ? "Sufficient balance available"
                    : "Insufficient balance"
                }
                description={
                  detailedUserData.balance >= quantity * selectedProduct.price
                    ? `Your balance: ${formatBalance(
                        detailedUserData.balance
                      )} coins`
                    : `Your balance: ${formatBalance(
                        detailedUserData.balance
                      )} coins. You need ${formatBalance(
                        quantity * selectedProduct.price -
                          detailedUserData.balance
                      )} more coins.`
                }
                type={
                  detailedUserData.balance >= quantity * selectedProduct.price
                    ? "success"
                    : "warning"
                }
                showIcon
                className="rounded-lg"
              />
            )}
          </div>
        </Modal>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-6xl mx-auto px-4">
          <Row gutter={[32, 32]}>
            <Col xs={24} sm={8}>
              <Title level={4} className="text-white mb-4">
                Company
              </Title>
              <Space direction="vertical">
                <Text className="text-gray-400 hover:text-white cursor-pointer transition-colors">
                  About Us
                </Text>
                <Text className="text-gray-400 hover:text-white cursor-pointer transition-colors">
                  Careers
                </Text>
                <Text className="text-gray-400 hover:text-white cursor-pointer transition-colors">
                  Contact Us
                </Text>
              </Space>
            </Col>
            <Col xs={24} sm={8}>
              <Title level={4} className="text-white mb-4">
                Support
              </Title>
              <Space direction="vertical">
                <Text className="text-gray-400 hover:text-white cursor-pointer transition-colors">
                  Help Center
                </Text>
                <Text className="text-gray-400 hover:text-white cursor-pointer transition-colors">
                  FAQs
                </Text>
                <Text className="text-gray-400 hover:text-white cursor-pointer transition-colors">
                  Terms of Service
                </Text>
              </Space>
            </Col>
            <Col xs={24} sm={8}>
              <Title level={4} className="text-white mb-4">
                Contact
              </Title>
              <Space direction="vertical">
                <Text className="text-gray-400">
                  Email: support@adsaccounts.com
                </Text>
                <Text className="text-gray-400">Phone: +1 (555) 123-4567</Text>
                <Text className="text-gray-400">
                  Address: 123 Marketing St, NY
                </Text>
              </Space>
            </Col>
          </Row>
          <Divider className="border-gray-700 my-8" />
          <div className="text-center">
            <Text className="text-gray-400">
              © 2025 AdsAccounts. All rights reserved.
            </Text>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TicketProduct;
