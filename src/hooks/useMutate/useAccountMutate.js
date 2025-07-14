import {
  authLoginApi,
  SendOTPEmailApi,
  SignUpApi,
  VerifyOTPEmailApi,
} from "../../api/account";
import { useMutation } from "@tanstack/react-query";
import { message } from "antd";
import { useNavigate } from "react-router";
import UseCookie from "../UseCookie";
import { toast } from "react-toastify";

function useAccountMutate() {
  const navigate = useNavigate();

  const { saveToken, removeToken } = UseCookie();

  const { mutateAsync: authSignup, isLoading: loadingSignup } = useMutation({
    mutationFn: SignUpApi,
    onSuccess: (data) => {
      if (data.httpCode === 201) {
        toast.success("Registration successful.", {
          position: "top-right",
          autoClose: 3000,
        });
        navigate("/");
      } else {
        toast.error("Registration failed. Please try again.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    },
    onError: () => {
      toast.error("An error occurred during registration.", {
        position: "top-right",
        autoClose: 3000,
      });
    },
  });

  const { mutateAsync: authSendOTPEmail, isLoading: loadingSendOTPEmail } =
    useMutation({
      mutationFn: SendOTPEmailApi,
      onSuccess: (data) => {
        if (data.httpCode === 201) {
          toast.success("OTP has been sent to your email.", {
            position: "top-right",
            autoClose: 3000,
          });
        } else {
          toast.error("Failed to send OTP. Please try again.", {
            position: "top-right",
            autoClose: 3000,
          });
        }
      },
      onError: () => {
        toast.error("Registration failed. Please try again.", {
          position: "top-right",
          autoClose: 3000,
        });
      },
    });

  const { mutateAsync: authVerifyOTPEmail, isLoading: loadingVerifyOTPEmail } =
    useMutation({
      mutationFn: VerifyOTPEmailApi,
      onSuccess: (data) => {
        if (data.httpCode === 200) {
          toast.success("OTP has been sent to your email.", {
            position: "top-right",
            autoClose: 3000,
          });
        } else {
          toast.error("Failed to send OTP. Please try again.", {
            position: "top-right",
            autoClose: 3000,
          });
        }
      },
      onError: () => {
        toast.error("Registration failed. Please try again.", {
          position: "top-right",
          autoClose: 3000,
        });
      },
    });

  const {
    mutateAsync: handleLogin,
    data: accountdata,
    headers: accountInfo,
    isPending: loadingLogin,
  } = useMutation({
    mutationFn: authLoginApi,
    onSuccess: (data) => {
      removeToken();
      saveToken(data?.data.data.accessToken, data?.data.data.refreshToken);
      if (data?.data.kind == "1") {
        navigate("/admin/");
      } else {
        navigate("/");
      }
    },
    onError: (error) => {
      toast.error("Wrong password or email", {
        position: "top-right",
        autoClose: 3000,
      });
    },
  });

  return {
    loadingSignup,
    authSignup,
    authSendOTPEmail,
    loadingSendOTPEmail,
    authVerifyOTPEmail,
    loadingVerifyOTPEmail,
    handleLogin,
    accountdata,
    loadingLogin,
    accountInfo,
  };
}

export default useAccountMutate;
