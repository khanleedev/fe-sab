import React from "react";
import { useEffect } from "react";

import { Outlet } from "react-router";

const CmsLayout = () => {
  const userKind = JSON.parse(localStorage.getItem("userKind"));
  useEffect(() => {
    if (userKind) {
      console.log(userKind);
      if (userKind !== "1") {
        history.back();
      }
    }
  }, [userKind]);
  return (
    <div className=" ">
      <Outlet />
    </div>
  );
};

export default CmsLayout;
