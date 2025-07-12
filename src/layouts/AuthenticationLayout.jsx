import React from "react";
import { Outlet } from "react-router";
import bgImage from "../assets/bgLogin.png";

const AuthenticationLayout = () => {
  localStorage.clear();
  return (
    <div
      className="w-full h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <Outlet />
    </div>
  );
};

export default AuthenticationLayout;
