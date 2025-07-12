import React from "react";
import { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Spin,
  Avatar,
  Card,
  Divider,
  Row,
  Col,
  Typography,
  Space,
} from "antd";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import UseCookie from "../../hooks/UseCookie";
import Header from "../../components/user/common/Header";
import { getMeApi, getUserByIdApi, updateAccountApi } from "../../api/account";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EditOutlined,
  SaveOutlined,
  CrownOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const { Title, Text } = Typography;

const ProfilePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getToken } = UseCookie();
  const tokenData = getToken();

  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);

  const {
    data: userData,
    isLoading: isLoadingUser,
    error: userError,
  } = useQuery({
    queryKey: ["userData"],
    queryFn: () => getMeApi({}),
    enabled: !!tokenData,
    onError: (err) => {
      const errorMessage = err.response?.data?.message || t("failed_fetch_user");
      toast.error(errorMessage);
      if (err.response?.status === 401) {
        navigate("/login");
      }
    },
  });

  const {
    data: detailedUserData,
    isLoading: isLoadingDetailedUser,
    error: detailedUserError,
    refetch: refetchDetailedUser,
  } = useQuery({
    queryKey: ["detailedUserData", userData],
    queryFn: () =>
      getUserByIdApi("user", userData?.id).then((res) => {
        return res.data;
      }),
    onError: (err) => {
      const errorMessage =
        err.response?.data?.message || t("failed_fetch_detailed_user");
      toast.error(errorMessage);
    },
    enabled: !!userData,
  });

  const updateMutation = useMutation({
    mutationFn: (values) => updateAccountApi(values),
    onSuccess: () => {
      toast.success(t("profile_updated_successfully"));
      setIsEditing(false);
      refetchDetailedUser();
    },
    onError: (err) => {
      const errorMessage =
        err.response?.data?.message || t("failed_to_update_profile");
      toast.error(errorMessage);
    },
  });

  useEffect(() => {
    if (detailedUserData) {
      form.setFieldsValue({
        id: detailedUserData.id,
        email: detailedUserData.email,
        phoneNo: detailedUserData.phoneNo,
        username: detailedUserData.username,
      });
    }
  }, [detailedUserData, form]);

  const onFinish = (values) => {
    updateMutation.mutate({
      id: detailedUserData?.id,
      phoneNo: values.phoneNo,
      username: values.username,
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  const formatBalance = (balance) => {
    if (!balance) return "0";
    return new Intl.NumberFormat("en-US").format(balance);
  };

  if (isLoadingUser || isLoadingDetailedUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
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

  if (userError || detailedUserError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <Header />
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserOutlined className="text-red-500 text-2xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t("error_loading_profile")}
            </h3>
            <p className="text-gray-600 mb-6">{t("we_couldnt_load")}</p>
            <Button type="primary" onClick={() => window.location.reload()}>
              {t("try_again")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />

      <div className="max-w-6xl mx-auto p-6 sm:p-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <Title level={1} className="text-4xl font-bold text-gray-900 mb-2">
            {t("profile_settings")}
          </Title>
          <Text className="text-lg text-gray-600">{t("manage_account")}</Text>
        </div>

        <Row gutter={[24, 24]}>
          {/* Profile Overview Card */}
          <Col xs={24} lg={8}>
            <Card className="h-full shadow-lg border-0 rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 -m-6 mb-6 p-8 text-center">
                <Avatar
                  size={120}
                  src="https://randomuser.me/api/portraits/men/1.jpg"
                  className="border-4 border-white shadow-xl mb-4"
                />
                <Title level={3} className="text-white mb-1">
                  {detailedUserData?.username || t("user")}
                </Title>
                <div className="flex items-center justify-center gap-2 text-blue-100">
                  <CrownOutlined />
                  <Text className="text-blue-100">{t("premium_member")}</Text>
                </div>
              </div>

              <Space direction="vertical" size="large" className="w-full">
                {/* Account Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-xl">
                    <div className="text-2xl font-bold text-green-600">
                      {formatBalance(userData?.balance)}
                    </div>
                    <div className="text-sm text-green-700">{t("coins_balance")}</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">5</div>
                    <div className="text-sm text-blue-700">{t("active_accounts")}</div>
                  </div>
                </div>

                {/* Account Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <MailOutlined className="text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-gray-500 uppercase tracking-wide">
                        {t("email_address")}
                      </div>
                      <div className="font-medium text-gray-900">
                        {detailedUserData?.email || "N/A"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <CalendarOutlined className="text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-gray-500 uppercase tracking-wide">
                        {t("member_since")}
                      </div>
                      <div className="font-medium text-gray-900">
                        {formatDate(
                          detailedUserData?.createdAt ||
                            detailedUserData?.created_at
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="text-xs text-gray-500 uppercase tracking-wide">
                        {t("account_status")}
                      </div>
                      <div className="font-medium text-green-600">{t("verified")}</div>
                    </div>
                  </div>
                </div>
              </Space>
            </Card>
          </Col>

          {/* Edit Profile Form */}
          <Col xs={24} lg={16}>
            <Card className="shadow-lg border-0 rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <Title level={2} className="mb-1">
                    {t("personal_information")}
                  </Title>
                  <Text className="text-gray-600">{t("update_personal_details")}</Text>
                </div>
                {!isEditing && (
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {t("edit_profile")}
                  </Button>
                )}
              </div>

              <Divider />

              <Form
                form={form}
                name="profile"
                onFinish={onFinish}
                layout="vertical"
                className="space-y-6"
                disabled={!isEditing}
              >
                <Row gutter={[24, 0]}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="email"
                      label={
                        <span className="text-base font-semibold text-gray-700 flex items-center gap-2">
                          <MailOutlined className="text-blue-600" />
                          {t("email_address")}
                        </span>
                      }
                    >
                      <Input
                        disabled
                        size="large"
                        className="rounded-lg border-gray-300 bg-gray-50"
                        placeholder={t("email_address")}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="phoneNo"
                      label={
                        <span className="text-base font-semibold text-gray-700 flex items-center gap-2">
                          <PhoneOutlined className="text-green-600" />
                          {t("phone_number")}
                        </span>
                      }
                      rules={[
                        {
                          required: true,
                          message: t("please_input_phone"),
                        },
                      ]}
                    >
                      <Input
                        size="large"
                        className="rounded-lg border-gray-300"
                        placeholder={t("phone_number")}
                        disabled={!isEditing}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24}>
                    <Form.Item
                      name="username"
                      label={
                        <span className="text-base font-semibold text-gray-700 flex items-center gap-2">
                          <UserOutlined className="text-purple-600" />
                          {t("username")}
                        </span>
                      }
                      rules={[
                        {
                          required: true,
                          message: t("please_input_username"),
                        },
                      ]}
                    >
                      <Input
                        size="large"
                        className="rounded-lg border-gray-300"
                        placeholder={t("username")}
                        disabled={!isEditing}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                {isEditing && (
                  <div className="flex gap-4 pt-6 border-t border-gray-200">
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={updateMutation.isLoading}
                      icon={<SaveOutlined />}
                      size="large"
                      className="bg-blue-600 hover:bg-blue-700 px-8"
                    >
                      {t("save_changes")}
                    </Button>
                    <Button
                      type="default"
                      onClick={() => {
                        setIsEditing(false);
                        form.resetFields();
                      }}
                      size="large"
                      className="px-8"
                    >
                      {t("cancel")}
                    </Button>
                  </div>
                )}
              </Form>

              {!isEditing && (
                <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="flex items-start gap-4">
                    <div>
                      <Title level={4} className="text-blue-900 mb-2">
                        {t("account_security")}
                      </Title>
                      <Text className="text-blue-700">{t("security_info")}</Text>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ProfilePage;