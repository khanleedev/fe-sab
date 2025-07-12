import React from "react";
import { Dropdown, Avatar, Button, message, Badge, Spin, Menu } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  WalletOutlined,
  HistoryOutlined,
  ShoppingOutlined,
  DownOutlined,
  BarChartOutlined,
  BellOutlined,
  CrownOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import UseCookie from "../../../hooks/UseCookie";
import { useQuery } from "@tanstack/react-query";
import { getMeApi, getUserByIdApi } from "../../../api/account";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import i18n from "../../../i18n"; // Đảm bảo import i18n từ file cấu hình

const Header = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { removeToken, getToken } = UseCookie();
  const tokenData = getToken();

  const handleLogout = () => {
    removeToken();
    message.success(t("logged_out_success"));
    navigate("/login");
  };

  // First query: Fetch user data from getMeApi
  const {
    data: userData,
    isLoading: isLoadingUser,
    // error: userError,
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
        navigate("/");
      }
    },
    enabled: !!tokenData,
  });

  const {
    // data: detailedUserData,
    isLoading: isLoadingDetailedUser,
    // error: detailedUserError,
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

  const formatBalance = (balance) => {
    if (!balance) return "0";
    return new Intl.NumberFormat("vi-VN").format(balance); // Có thể điều chỉnh theo ngôn ngữ
  };

  // Menu cho chọn ngôn ngữ
  const languageMenu = (
    <Menu>
      <Menu.Item key="en" onClick={() => i18n.changeLanguage("en")}>
        English
      </Menu.Item>
      <Menu.Item key="vi" onClick={() => i18n.changeLanguage("vi")}>
        Tiếng Việt
      </Menu.Item>
      <Menu.Item key="ms" onClick={() => i18n.changeLanguage("ms")}>
        Bahasa Melayu
      </Menu.Item>
      <Menu.Item key="zh" onClick={() => i18n.changeLanguage("zh")}>
        中文 (Chinese)
      </Menu.Item>
      <Menu.Item key="hi" onClick={() => i18n.changeLanguage("hi")}>
        हिंदी (Hindi)
      </Menu.Item>
      <Menu.Item key="th" onClick={() => i18n.changeLanguage("th")}>
        ไทย (Thai)
      </Menu.Item>
      <Menu.Item key="ru" onClick={() => i18n.changeLanguage("ru")}>
        Русский (Russian)
      </Menu.Item>
    </Menu>
  );

  const profileMenu = (
    <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-100 w-72">
      {/* User Info Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-white">
              {userData?.username || userData?.email || t("user")}
            </h3>
            <p className="text-blue-100 text-sm opacity-90">
              {userData?.email || "nguoi_dung@example.com"}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <CrownOutlined className="text-yellow-300 text-xs" />
              <span className="text-xs text-blue-100">
                {t("premium_member")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Balance Section */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
              {t("account_balance")}
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {isLoadingUser || isLoadingDetailedUser ? (
                <Spin size="small" />
              ) : (
                `${formatBalance(userData?.balance)} coins`
              )}
            </p>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <WalletOutlined className="text-green-600 text-lg" />
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="py-2">
        <div
          className="flex items-center gap-3 px-6 py-3 hover:bg-blue-50 cursor-pointer transition-all duration-200 group"
          onClick={() => navigate("/profile")}
        >
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
            <UserOutlined className="text-blue-600" />
          </div>
          <div className="flex-1">
            <span className="text-gray-700 font-medium">
              {t("profile_settings")}
            </span>
            <p className="text-xs text-gray-500">{t("manage_account")}</p>
          </div>
        </div>

        <div
          className="flex items-center gap-3 px-6 py-3 hover:bg-green-50 cursor-pointer transition-all duration-200 group"
          onClick={() => navigate("/deposit")}
        >
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
            <WalletOutlined className="text-green-600" />
          </div>
          <div className="flex-1">
            <span className="text-gray-700 font-medium">{t("add_funds")}</span>
            <p className="text-xs text-gray-500">{t("deposit_account")}</p>
          </div>
        </div>

        <div
          className="flex items-center gap-3 px-6 py-3 hover:bg-purple-50 cursor-pointer transition-all duration-200 group"
          onClick={() => navigate("/deposit-history")}
        >
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
            <HistoryOutlined className="text-purple-600" />
          </div>
          <div className="flex-1">
            <span className="text-gray-700 font-medium">
              {t("deposit_history")}
            </span>
            <p className="text-xs text-gray-500">{t("view_past_deposits")}</p>
          </div>
        </div>

        <div
          className="flex items-center gap-3 px-6 py-3 hover:bg-orange-50 cursor-pointer transition-all duration-200 group"
          onClick={() => navigate("/purchase-history")}
        >
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors">
            <ShoppingOutlined className="text-orange-600" />
          </div>
          <div className="flex-1">
            <span className="text-gray-700 font-medium">
              {t("purchase_history")}
            </span>
            <p className="text-xs text-gray-500">{t("view_orders")}</p>
          </div>
        </div>

        <div
          className="flex items-center gap-3 px-6 py-3 hover:bg-indigo-50 cursor-pointer transition-all duration-200 group"
          onClick={() => navigate("/report")}
        >
          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
            <BarChartOutlined className="text-indigo-600" />
          </div>
          <div className="flex-1">
            <span className="text-gray-700 font-medium">{t("analytics")}</span>
            <p className="text-xs text-gray-500">{t("view_reports")}</p>
          </div>
        </div>
      </div>

      {/* Logout Section */}
      <div className="border-t border-gray-100 p-2">
        <div
          className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 cursor-pointer transition-all duration-200 group rounded-lg"
          onClick={handleLogout}
        >
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
            <LogoutOutlined className="text-red-600" />
          </div>
          <span className="text-gray-700 font-medium">{t("sign_out")}</span>
        </div>
      </div>
    </div>
  );

  return (
    <header className="sticky top-0 z-50 bg-white shadow-lg border-b border-gray-200 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center gap-4 sm:gap-8">
            <div
              className="flex items-center gap-2 sm:gap-3 cursor-pointer group"
              onClick={() => navigate("/")}
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <span className="text-white font-bold text-base sm:text-lg">
                  A
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hidden sm:block">
                AdsAccounts
              </h1>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Language Selector */}
            <Dropdown
              overlay={languageMenu}
              trigger={["click"]}
              placement="bottomRight"
              className="hidden sm:block"
            >
              <Button
                icon={<GlobalOutlined />}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
              >
                {t("language")} <DownOutlined />
              </Button>
            </Dropdown>

            {userData ? (
              <>
                {/* User Dropdown */}
                <Dropdown
                  overlay={profileMenu}
                  trigger={["click"]}
                  placement="bottomRight"
                >
                  <div className="flex items-center gap-1 sm:gap-2 cursor-pointer hover:bg-gray-50 p-1 sm:p-2 rounded-lg sm:rounded-xl transition-all duration-200 group">
                    <Avatar
                      src="https://randomuser.me/api/portraits/men/1.jpg"
                      size={28} // Giảm kích thước trên mobile
                      className="border-2 border-blue-200 group-hover:border-blue-300 transition-colors"
                    />
                    <div className="hidden sm:block text-left">
                      <p className="text-xs sm:text-sm font-semibold text-gray-900">
                        {userData?.username || t("user")}
                      </p>
                      <p className="text-xs text-gray-500">Premium</p>
                    </div>
                    <DownOutlined className="text-gray-400 text-xs group-hover:text-gray-600 transition-colors" />
                  </div>
                </Dropdown>
              </>
            ) : (
              <div className="flex items-center gap-1 sm:gap-2">
                <Button
                  type="default"
                  onClick={() => navigate("/signup")}
                  className="hidden sm:inline-flex border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 text-xs sm:text-sm py-1 sm:py-2 px-2 sm:px-4"
                >
                  {t("sign_up")}
                </Button>
                <Button
                  type="primary"
                  onClick={() => navigate("/login")}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 border-none hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 text-xs sm:text-sm py-1 sm:py-2 px-2 sm:px-4"
                >
                  {t("sign_in")}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
