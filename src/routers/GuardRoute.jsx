import React from "react";
import { useEffect } from "react";
// import UseCookie from "../hooks/UseCookie";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";

const GuardRoute = ({ children }, path) => {
  //   const { isLoggedIn } = UseCookie();
  const queryClient = useQueryClient();
  // const { getProfileAccount } = useAccount();
  const navigate = useNavigate();
  //   useEffect(() => {
  //     if (isLoggedIn()) {
  //       // getProfileAccount();
  //       queryClient.invalidateQueries(["accountProfile"]);
  //     } else {
  //       navigate("/");
  //     }
  //   }, []);
  return (
    <div className="w-full h-fit">
      {/* {loadingPage ? (
        <LoadingPage
          css={
            "absolute  justify-center items-center place-items-center h-full w-full bg-white dark:bg-black"
          }
        />
      ) : ( */}
      <div className="w-full h-fit">{children}</div>
      {/* )} */}
    </div>
  );
};
export default GuardRoute;
