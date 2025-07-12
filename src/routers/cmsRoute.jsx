import React from "react";
import CmsLayout from "../layouts/CmsLayout";
import CmsPage from "../pages/admin/CmsPage";
import UsersContent from "../components/admin/UsersContent";
import Ticket from "../components/admin/Ticket";
import TicketProduct from "../components/admin/TicketProduct";
import Report from "../components/admin/Report";

// Xem cấu trúc routes ở https://reactrouter.com/en/main/routers/create-browser-router#routes
export default function init(routes) {
  const route = {
    path: "/",

    element: <CmsLayout />,
    // Element là AuthenLayout, các children muốn hiển thị được trong AuthenLayout thì trong Layout phải có outlet mới hiển thị được
    // outlet đóng vai trò tương tự children
    // Xem thêm ở https://reactrouter.com/en/main/components/outlet
    children: [
      {
        path: "/admin/",
        element: <CmsPage />,
        children: [
          {
            path: "users",
            element: <UsersContent />,
          },
          {
            path: "tickets",
            element: <Ticket />,
          },
          {
            path: "ticketproduct",
            element: <TicketProduct />,
          },
          {
            path: "report",
            element: <Report />,
          },
        ],
      },
    ],
  };
  // push route
  routes.push(route);
}
