import React from "react";
import { toast } from "react-toastify";
import { Footer } from "../../components/home/Footer";
import { HeroSection } from "../../components/home/HeroSection";
import Header from "../../components/user/common/Header";
import { useQuery } from "@tanstack/react-query";
import { getMeApi } from "../../api/account";
import { useNavigate } from "react-router";
import { Row, Col, Card, Typography } from "antd";
import {
  ArrowRightOutlined,
  FacebookOutlined,
  GoogleOutlined,
  InstagramOutlined,
  LinkedinOutlined,
  TikTokOutlined,
  TwitterOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { getListTicketApi } from "../../api/ticket";
import { useTranslation } from "react-i18next";
import { useRef } from "react";

export default function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");
  // Create a ref for the accounts section
  const accountsSectionRef = useRef(null);

  // Function to scroll to the accounts section
  const scrollToAccounts = () => {
    accountsSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  // Fetch user data
  const {
    data: userData,
    isLoading: isLoadingUser,
    error: userError,
  } = useQuery({
    queryKey: ["userData"],
    queryFn: () => getMeApi({}),
    onError: (err) => {
      const errorMessage =
        err.response?.data?.message || t("failed_fetch_user");
      toast.error(errorMessage);
      if (err.response?.status === 401) {
        navigate("/login");
      }
    },
    enabled: !!accessToken,
    retry: false,
  });

  // Fetch tickets, only if user is logged in
  const {
    data: listTicket,
    // isLoading: isLoadingTickets,
    // error: ticketError,
  } = useQuery({
    queryKey: ["listTicket"],
    queryFn: () =>
      getListTicketApi({}).then((res) => {
        return res.data.data.content || res.data.data.data;
      }),
    onError: (err) => {
      const errorMessage =
        err.response?.data?.message || t("failed_fetch_detailed_user");
      toast.error(errorMessage);
      if (err.response?.status === 401) {
        navigate("/login");
      }
    },
    retry: false,
  });

  // Handler to navigate to /ticket/ with ticketId as query parameter
  const handleTicketClick = (ticketId) => {
    if (!accessToken) {
      toast.error(t("please_login"));
      return;
    }

    navigate(`/ticket/${ticketId}`);
  };

  const getPlatformIcon = (title) => {
    const titleLower = title.toLowerCase();

    if (titleLower.includes("facebook")) {
      return (
        <FacebookOutlined style={{ fontSize: "32px", color: "#1877F2" }} />
      );
    } else if (titleLower.includes("google")) {
      return <GoogleOutlined style={{ fontSize: "32px", color: "#4285F4" }} />;
    } else if (titleLower.includes("instagram")) {
      return (
        <InstagramOutlined style={{ fontSize: "32px", color: "#E4405F" }} />
      );
    } else if (titleLower.includes("twitter")) {
      return <TwitterOutlined style={{ fontSize: "32px", color: "#1DA1F2" }} />;
    } else if (titleLower.includes("linkedin")) {
      return (
        <LinkedinOutlined style={{ fontSize: "32px", color: "#0A66C2" }} />
      );
    } else if (titleLower.includes("tiktok")) {
      return <TikTokOutlined style={{ fontSize: "32px", color: "#000000" }} />;
    } else {
      return <UserOutlined style={{ fontSize: "32px", color: "#6366F1" }} />;
    }
  };

  // Function to get platform color scheme
  const getPlatformColors = (title) => {
    const titleLower = title.toLowerCase();

    if (titleLower.includes("facebook")) {
      return {
        gradient: "linear-gradient(135deg, #1877F2 0%, #42A5F5 100%)",
        shadow: "0 8px 32px rgba(24, 119, 242, 0.3)",
        border: "#1877F2",
      };
    } else if (titleLower.includes("google")) {
      return {
        gradient:
          "linear-gradient(135deg, #4285F4 0%, #34A853 50%, #FBBC05 100%)",
        shadow: "0 8px 32px rgba(66, 133, 244, 0.3)",
        border: "#4285F4",
      };
    } else if (titleLower.includes("instagram")) {
      return {
        gradient:
          "linear-gradient(135deg, #E4405F 0%, #F77737 50%, #FCAF45 100%)",
        shadow: "0 8px 32px rgba(228, 64, 95, 0.3)",
        border: "#E4405F",
      };
    } else if (titleLower.includes("twitter")) {
      return {
        gradient: "linear-gradient(135deg, #1DA1F2 0%, #0084B4 100%)",
        shadow: "0 8px 32px rgba(29, 161, 242, 0.3)",
        border: "#1DA1F2",
      };
    } else if (titleLower.includes("linkedin")) {
      return {
        gradient: "linear-gradient(135deg, #0A66C2 0%, #004182 100%)",
        shadow: "0 8px 32px rgba(10, 102, 194, 0.3)",
        border: "#0A66C2",
      };
    } else if (titleLower.includes("tiktok")) {
      return {
        gradient:
          "linear-gradient(135deg, #000000 0%, #FF0050 50%, #00F2EA 100%)",
        shadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        border: "#000000",
      };
    } else {
      return {
        gradient: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
        shadow: "0 8px 32px rgba(99, 102, 241, 0.3)",
        border: "#6366F1",
      };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <HeroSection scrollToAccounts={scrollToAccounts} />
        <div className="py-16 sm:py-24 px-4 sm:px-10 bg-white w-full">
          <div className="max-w-4xl mx-auto mb-12">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-6 text-center shadow-lg border border-gray-100">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {listTicket?.length || 0}
                </div>
                <div className="text-sm text-gray-600">
                  {t("total_accounts")}
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 text-center shadow-lg border border-gray-100">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {listTicket?.length || 0}
                </div>
                <div className="text-sm text-gray-600">
                  {t("active_accounts")}
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 text-center shadow-lg border border-gray-100">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  24/7
                </div>
                <div className="text-sm text-gray-600">
                  {t("support_available")}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center items-center">
            <Row
              ref={accountsSectionRef}
              gutter={[24, 24]}
              justify="center"
              className="w-full mx-auto justify-center"
            >
              {listTicket?.map((ticket) => {
                const colors = getPlatformColors(ticket.title);

                return (
                  <Col xs={24} sm={12} md={8} lg={6} key={ticket.id}>
                    <Card
                      hoverable
                      className="relative overflow-hidden transition-all duration-300 hover:scale-105 cursor-pointer group"
                      style={{
                        borderRadius: "20px",
                        minHeight: "200px",
                        border: `2px solid ${colors.border}20`,
                        background: "white",
                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                      }}
                      bodyStyle={{ padding: 0 }}
                      onClick={() => handleTicketClick(ticket.id)}
                    >
                      {/* Gradient Header */}
                      <div
                        className="h-20 relative"
                        style={{
                          background: colors.gradient,
                          borderRadius: "18px 18px 0 0",
                        }}
                      >
                        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
                        <div className="absolute top-4 right-4">
                          <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                            <ArrowRightOutlined
                              style={{ color: "white", fontSize: "14px" }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 text-center">
                        {/* Platform Icon */}
                        <div className="flex justify-center mb-4 transform group-hover:scale-110 transition-transform duration-300">
                          <div
                            className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
                            style={{
                              background: "white",
                              border: `3px solid ${colors.border}`,
                              marginTop: "-40px",
                            }}
                          >
                            {getPlatformIcon(ticket.title)}
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                          {ticket.title}
                        </h3>

                        {/* Subtitle */}
                        <p className="text-sm text-gray-500 mb-4">
                          {t("premium_account")}
                        </p>

                        {/* Status Badge */}
                        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                          {t("active")}
                        </div>
                      </div>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
