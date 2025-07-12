import React from "react";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/main/HomePage";

import GuardRoute from "./GuardRoute";
import TicketProduct from "../components/user/TicketProduct";
import DepositPage from "../pages/main/DepositPage";
import PurchaseHistory from "../pages/main/PurchaseHistory";
import ProfilePage from "../pages/main/ProfilePage";
import DepositHistory from "../pages/main/DepositHistory";
import ReportPage from "../pages/main/ReportPage";

// Xem cấu trúc routes ở https://reactrouter.com/en/main/routers/create-browser-router#routes
export default function init(routes) {
  const route = {
    path: "/",

    element: <MainLayout />,
    // Element là AuthenLayout, các children muốn hiển thị được trong AuthenLayout thì trong Layout phải có outlet mới hiển thị được
    // outlet đóng vai trò tương tự children
    // Xem thêm ở https://reactrouter.com/en/main/components/outlet
    children: [
      {
        index: true,
        element: (
          <GuardRoute path="/">
            <HomePage />
          </GuardRoute>
        ),
      },
      {
        path: "/ticket/:ticketId",
        element: (
          <GuardRoute path="/ticket/:ticketId">
            <TicketProduct />
          </GuardRoute>
        ),
      },
      {
        path: "/deposit",
        element: (
          <GuardRoute path="/deposit">
            <DepositPage />
          </GuardRoute>
        ),
      },
      {
        path: "/purchase-history",
        element: (
          <GuardRoute path="/purchase-history">
            <PurchaseHistory />
          </GuardRoute>
        ),
      },
      {
        path: "/deposit-history",
        element: (
          <GuardRoute path="/deposit-history">
            <DepositHistory />
          </GuardRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <GuardRoute path="/profile">
            <ProfilePage />
          </GuardRoute>
        ),
      },
      {
        path: "/report",
        element: (
          <GuardRoute path="/report">
            <ReportPage />
          </GuardRoute>
        ),
      },
    ],
  };
  // push route
  routes.push(route);
}
