import React, { useState, useEffect, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Form,
  InputNumber,
  Select,
  Card,
  Steps,
  Typography,
  Space,
  Row,
  Col,
  Alert,
  Progress,
  Divider,
} from "antd";
import { createTransactionForPaymentApi } from "../../api/paymentTransaction";
import {
  WalletOutlined,
  CreditCardOutlined,
  QrcodeOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  BankOutlined,
  MobileOutlined,
  SafetyOutlined,
  InfoCircleOutlined,
  DollarOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import UseCookie from "../../hooks/UseCookie";
import { useNavigate } from "react-router";
import Header from "../../components/user/common/Header";
import { useTranslation } from "react-i18next";

const { Option } = Select;
const { Title, Text } = Typography;

const DepositPage = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes in seconds
  const [initialBalance, setInitialBalance] = useState(null); // Track initial balance
  const navigate = useNavigate();
  const { removeToken } = UseCookie();
  const queryClient = useQueryClient();
  const timeoutRef = useRef(null);
  const balanceIntervalRef = useRef(null);
  const countdownRef = useRef(null);

  const { mutateAsync: createTransaction, isLoading } = useMutation({
    mutationFn: createTransactionForPaymentApi,
    onSuccess: (data) => {
      const qrUrl = data.data;
      if (qrUrl) {
        setQrCodeUrl(qrUrl);
        setCurrentStep(2);
        setTimeRemaining(300);
        toast.success(
          t("deposit_transaction_created") +
            " " +
            t("please_scan_qr_to_pay")
        );

        // Store initial balance
        const userData = queryClient.getQueryData(["userData"]);
        setInitialBalance(userData?.balance || 0);

        // Start countdown
        countdownRef.current = setInterval(() => {
          setTimeRemaining((prev) => {
            if (prev <= 1) {
              clearInterval(countdownRef.current);
              setQrCodeUrl(null);
              setCurrentStep(0);
              clearInterval(balanceIntervalRef.current);
              toast.info(t("qr_expired"));
              form.resetFields();
              return 300;
            }
            return prev - 1;
          });
        }, 1000);

        // Set timeout to hide QR code after 5 minutes
        timeoutRef.current = setTimeout(() => {
          setQrCodeUrl(null);
          setCurrentStep(0);
          clearInterval(balanceIntervalRef.current);
          clearInterval(countdownRef.current);
          toast.info(t("qr_expired"));
          form.resetFields();
        }, 300000);

        // Start invalidating userData query every 3 seconds to update balance
        balanceIntervalRef.current = setInterval(() => {
          queryClient.invalidateQueries(["userData"]).then(() => {
            const updatedUserData = queryClient.getQueryData(["userData"]);
            const newBalance = updatedUserData?.balance || 0;

            if (newBalance > initialBalance) {
              // Balance increased, move to "Complete" step
              clearInterval(balanceIntervalRef.current);
              clearInterval(countdownRef.current);
              clearTimeout(timeoutRef.current);
              setQrCodeUrl(null);
              setCurrentStep(3); // Move to "Complete" step
              toast.success(t("deposit_success"));
              form.resetFields();
              navigate("/");
            }
          });
        }, 3000);
      } else {
        toast.error(t("failed_retrieve_qr"));
      }
    },
    onError: (err) => {
      const errorMessage =
        err.response?.data?.message || t("failed_deposit");
      toast.error(errorMessage);
      if (err.response?.status === 401) {
        removeToken();
        navigate("/login");
      }
    },
  });

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
      clearInterval(balanceIntervalRef.current);
      clearInterval(countdownRef.current);
    };
  }, []);

  const onFinish = (values) => {
    if (paymentMethod === "bank_card") {
      setCurrentStep(1);
      clearTimeout(timeoutRef.current);
      clearInterval(balanceIntervalRef.current);
      clearInterval(countdownRef.current);
      const payload = {
        amount: values.transferAmount,
      };
      createTransaction(payload);
    } else {
      toast.warning(t("only_bank_card_supported"));
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const steps = [
    {
      title: t("enter_amount"),
      icon: <DollarOutlined />,
      description: t("choose_deposit"),
    },
    {
      title: t("processing"),
      icon: <ClockCircleOutlined />,
      description: t("creating_payment"),
    },
    {
      title: t("scan_qr_code"),
      icon: <QrcodeOutlined />,
      description: t("complete_payment"),
    },
    {
      title: t("complete"),
      icon: <CheckCircleOutlined />,
      description: t("payment_confirmed"),
    },
  ];

  const paymentMethods = [
    {
      value: "bank_card",
      label: t("bank_transfer_sepay"),
      icon: <BankOutlined className="text-blue-600" />,
      description: t("secure_bank_transfer"),
      available: true,
      processingTime: "Instant",
    },
    {
      value: "ewallet",
      label: t("ewallet"),
      icon: <MobileOutlined className="text-gray-400" />,
      description: t("mobile_wallet_payment"),
      available: false,
      processingTime: t("coming_soon"),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />

      <div className="max-w-4xl mx-auto p-6 sm:p-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <WalletOutlined className="text-blue-600 text-2xl" />
          </div>
          <Title level={1} className="text-4xl font-bold text-gray-900 mb-2">
            {t("add_funds")}
          </Title>
          <Text className="text-lg text-gray-600">
            {t("deposit_account")}
          </Text>
        </div>

        {/* Progress Steps */}
        <Card className="mb-8 shadow-lg border-0 rounded-2xl">
          <Steps current={currentStep} className="mb-6">
            {steps.map((step, index) => (
              <Steps.Step
                key={index}
                title={step.title}
                description={step.description}
                icon={step.icon}
              />
            ))}
          </Steps>
        </Card>

        <Row gutter={[24, 24]}>
          {/* Deposit Form */}
          <Col xs={24} lg={qrCodeUrl ? 12 : 16}>
            <Card className="shadow-lg border-0 rounded-2xl h-full">
              <div className="mb-6">
                <Title level={3} className="flex items-center gap-2 mb-2">
                  <CreditCardOutlined className="text-blue-600" />
                  {t("deposit_information")}
                </Title>
             
              </div>

              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                className="space-y-6"
              >
                <Form.Item
                  label={
                    <span className="text-base font-semibold text-gray-700 flex items-center gap-2">
                      <DollarOutlined className="text-green-600" />
                      {t("deposit_amount")}
                    </span>
                  }
                  name="transferAmount"
                  rules={[
                    { required: true, message: t("please_input_amount") },
                    {
                      type: "number",
                      min: 1,
                      message: t("amount_must_be_at_least"),
                    },
                  ]}
                >
                  <InputNumber
                    size="large"
                    min={1}
                    className="w-full rounded-lg"
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    placeholder={t("enter_amount")}
                    addonAfter="VND"
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <span className="text-base font-semibold text-gray-700 flex items-center gap-2">
                      <CreditCardOutlined className="text-purple-600" />
                      {t("payment_method")}
                    </span>
                  }
                  name="paymentMethod"
                  rules={[
                    {
                      required: true,
                      message: t("please_select_method"),
                    },
                  ]}
                >
                  <Select
                    size="large"
                    placeholder={t("select_payment_method")}
                    onChange={(value) => setPaymentMethod(value)}
                    className="rounded-lg"
                  >
                    {paymentMethods.map((method) => (
                      <Option
                        key={method.value}
                        value={method.value}
                        disabled={!method.available}
                      >
                        <div className="flex items-center justify-between py-2">
                          <div className="flex items-center gap-3">
                            {method.icon}
                            <div>
                              <div className="font-medium">{method.label}</div>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500">
                            {method.processingTime}
                          </div>
                        </div>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isLoading}
                    size="large"
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 border-none hover:from-blue-700 hover:to-purple-700 rounded-lg font-semibold"
                    icon={<WalletOutlined />}
                  >
                    {isLoading
                      ? t("creating_transaction")
                      : t("create_deposit_transaction")}
                  </Button>
                </Form.Item>
              </Form>

              {/* Security Notice */}
              <Alert
                message={t("secure_payment")}
                description={t("secure_payment_desc")}
                type="info"
                icon={<SafetyOutlined />}
                className="mt-6 rounded-lg"
                showIcon
              />
            </Card>
          </Col>

          {/* QR Code or Complete Section */}
          {qrCodeUrl ? (
            <Col xs={24} lg={12}>
              <Card className="shadow-lg border-0 rounded-2xl h-full">
                <div className="text-center">
                  <div className="mb-6">
                    <Title
                      level={3}
                      className="flex items-center justify-center gap-2 mb-2"
                    >
                      <QrcodeOutlined className="text-blue-600" />
                      {t("scan_qr_code")}
                    </Title>
                    <Text className="text-gray-600">
                      {t("use_banking_app_to_scan")}
                    </Text>
                  </div>

                  {/* Countdown Timer */}
                  <div className="mb-6">
                    <div className="inline-flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-full border border-orange-200">
                      <ClockCircleOutlined className="text-orange-600" />
                      <Text className="text-orange-700 font-medium">
                        {t("time_remaining")}: {formatTime(timeRemaining)}
                      </Text>
                    </div>
                    <Progress
                      percent={(timeRemaining / 300) * 100}
                      showInfo={false}
                      strokeColor={{
                        "0%": "#f59e0b",
                        "100%": "#ef4444",
                      }}
                      className="mt-2"
                    />
                  </div>

                  {/* QR Code */}
                  <div className="bg-white p-6 rounded-2xl border-2 border-gray-200 inline-block mb-6">
                    <img
                      src={qrCodeUrl || "/placeholder.svg"}
                      alt={t("payment_qr_code")}
                      className="max-w-full h-auto"
                      style={{ maxWidth: "250px" }}
                    />
                  </div>

                  {/* Instructions */}
                  <div className="text-left space-y-3">
                    <Title level={5} className="text-gray-900">
                      {t("payment_instructions")}
                    </Title>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs font-bold">
                          1
                        </div>
                        <span>{t("open_banking_app")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs font-bold">
                          2
                        </div>
                        <span>{t("scan_qr")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs font-bold">
                          3
                        </div>
                        <span>{t("confirm_amount")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs font-bold">
                          4
                        </div>
                        <span>{t("complete_transaction")}</span>
                      </div>
                    </div>
                  </div>

                  <Alert
                    message={t("payment_processing")}
                    description={t("payment_processing_desc")}
                    type="success"
                    icon={<InfoCircleOutlined />}
                    className="mt-6 rounded-lg text-left"
                    showIcon
                  />
                </div>
              </Card>
            </Col>
          ) : currentStep === 3 ? (
            <Col xs={24} lg={12}>
              <Card className="shadow-lg border-0 rounded-2xl h-full">
                <div className="text-center">
                  <div className="mb-6">
                    <Title
                      level={3}
                      className="flex items-center justify-center gap-2 mb-2"
                    >
                      <CheckCircleOutlined className="text-green-600" />
                      {t("deposit_successful")}
                    </Title>
                    <Text className="text-gray-600">
                      {t("deposit_processed")}
                    </Text>
                  </div>
                  <Button
                    type="primary"
                    size="large"
                    onClick={() => navigate("/home")}
                    className="h-12 bg-gradient-to-r from-blue-600 to-purple-600 border-none hover:from-blue-700 hover:to-purple-700 rounded-lg font-semibold"
                    icon={<HomeOutlined />}
                  >
                    {t("back_to_home")}
                  </Button>
                </div>
              </Card>
            </Col>
          ) : (
            <Col xs={24} lg={8}>
              <Card className="shadow-lg border-0 rounded-2xl h-full">
                <Title level={4} className="mb-4">
                  {t("deposit_information")}
                </Title>

                <Space direction="vertical" size="large" className="w-full">
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <BankOutlined className="text-blue-600" />
                      <Text strong className="text-blue-900">
                        {t("instant_processing")}
                      </Text>
                    </div>
                    <Text className="text-blue-700 text-sm">
                      {t("instant_processing_desc")}
                    </Text>
                  </div>

                  <div className="p-4 bg-green-50 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <SafetyOutlined className="text-green-600" />
                      <Text strong className="text-green-900">
                        {t("secure_safe")}
                      </Text>
                    </div>
                    <Text className="text-green-700 text-sm">
                      {t("secure_safe_desc")}
                    </Text>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <WalletOutlined className="text-purple-600" />
                      <Text strong className="text-purple-900">
                        {t("no_hidden_fees")}
                      </Text>
                    </div>
                    <Text className="text-purple-700 text-sm">
                      {t("no_hidden_fees_desc")}
                    </Text>
                  </div>
                </Space>

                <Divider />

                <div>
                  <Title level={5} className="mb-3">
                    {t("need_help")}
                  </Title>
                  <Text className="text-gray-600 text-sm">
                    {t("deposit_issue")}
                  </Text>
                  <Button type="link" className="p-0 mt-2 text-blue-600">
                    {t("contact_support")}
                  </Button>
                </div>
              </Card>
            </Col>
          )}
        </Row>
      </div>
    </div>
  );
};

export default DepositPage;