import React from "react";
import { Outlet } from "react-router";

const MainLayout = () => {
  return (
    <div className="w-full h-fit ">
      <Outlet />
    </div>
  );
};

export default MainLayout;
