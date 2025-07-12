import React from "react";
import { useState } from "react";
import {
  Button,
  Card,
  Typography,
  Row,
  Col,
  Form,
  Input,
  Alert,
  Space,
  Spin,
} from "antd";
import {
  FileTextOutlined,
  SendOutlined,
  UserOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  BugOutlined,
  QuestionCircleOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import UseCallApi from "../../hooks/UseCallApi";
import { createReportApi } from "../../api/report";
import Header from "../../components/user/common/Header";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import UseCookie from "../../hooks/UseCookie";
import { useNavigate } from "react-router";
import { getMeApi } from "../../api/account";
import { useTranslation } from "react-i18next";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const ReportPage = () => {
  const { t } = useTranslation();
  const { UsePost } = UseCallApi();
  const [form] = Form.useForm();
  const [reportType, setReportType] = useState("general");
  const { removeToken, getToken } = UseCookie();
  const navigate = useNavigate();
  const tokenData = getToken();

  const {
    data: userData,
    isLoading: isLoadingUser,
    error: userError,
  } = useQuery({
    queryKey: ["userData"],
    queryFn: () => getMeApi({}),
    enabled: !!tokenData,
    onError: (err) => {
      const errorMessage =
        err.response?.data?.message || t("failed_fetch_user");
      toast.error(errorMessage);
      if (err.response?.status === 401) {
        navigate("/login");
      }
    },
  });

  const { mutateAsync: createReport, isLoading: isLoadingCreateReport } =
    useMutation({
      mutationKey: ["createReport"],
      mutationFn: createReportApi,
      onSuccess: () => {
        toast.success(t("report_success"));
        form.resetFields();
      },
      onError: (err) => {
        const errorMessage =
          err.response?.data?.message || t("failed_create_report");
        toast.error(errorMessage);
        if (err.response?.status === 401) {
          removeToken();
          navigate("/login");
        }
      },
    });

  const handleSubmit = async (values) => {
    await createReport({
      content: values.content,
      accountId: userData?.id,
    });
  };

  const reportTypes = [
    {
      key: "bug",
      title: t("bug_report"),
      description: t("bug_desc"),
      icon: <BugOutlined className="text-red-500" />,
      color: "border-red-200 hover:border-red-300 hover:bg-red-50",
    },
    {
      key: "feature",
      title: t("feature_request"),
      description: t("feature_desc"),
      icon: <ToolOutlined className="text-blue-500" />,
      color: "border-blue-200 hover:border-blue-300 hover:bg-blue-50",
    },
    {
      key: "support",
      title: t("support_request"),
      description: t("support_desc"),
      icon: <QuestionCircleOutlined className="text-green-500" />,
      color: "border-green-200 hover:border-green-300 hover:bg-green-50",
    },
    {
      key: "general",
      title: t("general_feedback"),
      description: t("general_desc"),
      icon: <FileTextOutlined className="text-purple-500" />,
      color: "border-purple-200 hover:border-purple-300 hover:bg-purple-50",
    },
  ];

  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header />
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <Spin size="large" />
            <p className="mt-4 text-gray-600 text-lg">{t("loading_profile")}</p>
          </div>
        </div>
      </div>
    );
  }

  if (userError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header />
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ExclamationCircleOutlined className="text-red-500 text-2xl" />
            </div>
            <Title level={3} className="text-gray-900 mb-2">
              {t("error_loading_page")}
            </Title>
            <Text className="text-gray-600 mb-6">
              {t("we_couldnt_load")}. {t("contact_support")}
            </Text>
            <Button type="primary" onClick={() => window.location.reload()}>
              {t("refresh_page")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />

      <div className="max-w-4xl mx-auto p-6 sm:p-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
            <FileTextOutlined className="text-blue-600 text-2xl" />
          </div>
          <Title level={1} className="text-4xl font-bold text-gray-900 mb-4">
            {t("submit_report")}
          </Title>
          <Paragraph className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t("help_improve_services")}
          </Paragraph>
        </div>

        <Row gutter={[24, 24]}>
          {/* Report Type Selection */}
          <Col xs={24} lg={8}>
            <Card className="shadow-lg border-0 rounded-2xl h-full">
              <Title level={3} className="mb-6 flex items-center gap-2">
                <UserOutlined className="text-blue-600" />
                {t("report_type")}
              </Title>

              <Space direction="vertical" size="middle" className="w-full">
                {reportTypes.map((type) => (
                  <div
                    key={type.key}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                      reportType === type.key
                        ? "border-blue-500 bg-blue-50"
                        : `border-gray-200 ${type.color} transition-colors`
                    }`}
                    onClick={() => setReportType(type.key)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center">
                        {type.icon}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">
                          {type.title}
                        </div>
                        <div className="text-sm text-gray-600">
                          {type.description}
                        </div>
                      </div>
                      {reportType === type.key && (
                        <CheckCircleOutlined className="text-blue-500" />
                      )}
                    </div>
                  </div>
                ))}
              </Space>
            </Card>
          </Col>

          {/* Report Form */}
          <Col xs={24} lg={16}>
            <Card className="shadow-lg border-0 rounded-2xl h-full">
              <Title level={3} className="mb-6 flex items-center gap-2">
                <SendOutlined className="text-green-600" />
                {t("report_details")}
              </Title>

              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                className="space-y-6"
              >
                <Form.Item
                  name="content"
                  label={
                    <span className="text-base font-semibold text-gray-700 flex items-center gap-2">
                      <FileTextOutlined className="text-blue-600" />
                      {t("describe_your_report", { reportType: reportTypes.find((t) => t.key === reportType)?.title.toLowerCase() })}
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: t("please_provide_details"),
                    },
                    {
                      min: 10,
                      message: t("min_chars"),
                    },
                    {
                      max: 1000,
                      message: t("max_chars"),
                    },
                  ]}
                >
                  <TextArea
                    rows={8}
                    placeholder={t("report_placeholder", { reportType: reportTypes.find((t) => t.key === reportType)?.title.toLowerCase() })}
                    className="rounded-lg"
                    showCount
                    maxLength={1000}
                  />
                </Form.Item>

                <Alert
                  message={t("report_guidelines")}
                  description={
                    <ul className="mt-2 space-y-1 text-sm">
                      <li>
                        • {t("guideline_specific")}
                      </li>
                      <li>
                        • {t("guideline_reproduce")}
                      </li>
                      <li>
                        • {t("guideline_examples")}
                      </li>
                      <li>
                        • {t("guideline_response")}
                      </li>
                    </ul>
                  }
                  type="info"
                  icon={<ClockCircleOutlined />}
                  className="rounded-lg"
                  showIcon
                />

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isLoadingCreateReport}
                    size="large"
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-green-600 border-none hover:from-blue-700 hover:to-green-700 rounded-lg font-semibold"
                    icon={<SendOutlined />}
                  >
                    {isLoadingCreateReport
                      ? t("submitting_report")
                      : t("submit")}
                  </Button>
                </Form.Item>
              </Form>

              {/* Success Message */}
              <Alert
                message={t("what_happens_next")}
                description={
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircleOutlined className="text-green-500" />
                      <span>{t("review_by_team")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ClockCircleOutlined className="text-blue-500" />
                      <span>{t("response_time")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <UserOutlined className="text-purple-500" />
                      <span>{t("updates_via_email")}</span>
                    </div>
                  </div>
                }
                type="success"
                className="mt-6 rounded-lg"
                showIcon
              />
            </Card>
          </Col>
        </Row>

        {/* Additional Help Section */}
        <Card className="shadow-lg border-0 rounded-2xl mt-8">
          <div className="text-center">
            <Title level={4} className="mb-4">
              {t("need_immediate_help")}
            </Title>
            <Paragraph className="text-gray-600 mb-6">
              {t("urgent_assistance")}
            </Paragraph>
            <Space size="large">
              <Button type="default" size="large" className="rounded-lg">
                {t("live_chat")}
              </Button>
              <Button type="default" size="large" className="rounded-lg">
                {t("email_support")}
              </Button>
              <Button type="default" size="large" className="rounded-lg">
                {t("help_center")}
              </Button>
            </Space>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ReportPage;