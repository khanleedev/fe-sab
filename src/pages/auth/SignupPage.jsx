import React, { useState } from "react";
import { Form, Input, Button, Modal } from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import useAccountMutate from "../../hooks/useMutate/useAccountMutate";
import { message } from "antd";
import { useNavigate } from "react-router";

const SignupPage = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { authSendOTPEmail, authVerifyOTPEmail, authSignup } =
    useAccountMutate();
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = (values) => {
    const data = { email: values.email, username: values.username };
    setUserInfo({
      username: values.username,
      password: values.password,
      email: values.email,
      phoneNo: values.phoneNo,
    });
    authSendOTPEmail(data)
      .then(() => {
        showModal();
      })
      .catch((error) => {
        message.error("Đã xảy ra lỗi khi gửi OTP: " + error.message);
      });
  };
  const handleVerifyOTP = (values) => {
    const data = { otp: values.otp, email: userInfo.email };

    authVerifyOTPEmail(data)
      .then(() => {
        message.success("OTP verified successfully!");

        const signupData = {
          username: userInfo.username,
          email: userInfo.email,
          phoneNo: userInfo.phoneNo,
          password: userInfo.password,
        };

        authSignup(signupData)
          .then(() => {
            message.success("Signup successful!");
            setIsModalOpen(false);
            navigate("/login");
          })
          .catch((error) => {
            message.error("Signup failed: " + error.message);
          });
      })
      .catch((error) => {
        message.error("OTP verification failed: " + error.message);
      });
  };

  return (
    <div className="w-full h-screen flex justify-center items-center flex-col desktop:px-auto px-4">
      <div className="sm:w-[500px] h-auto w-full p-8 rounded-2xl bg-white flex flex-col shadow-lg">
        <Form form={form} name="signup" onFinish={onFinish}>
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <div>
              <span className="block text-left mb-2 text-xl font-semibold">
                Username
              </span>
              <Input
                prefix={<UserOutlined />}
                placeholder="Username"
                size="large"
              />
            </div>
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your email!",
                type: "email",
              },
            ]}
          >
            <div>
              <span className="block text-left mb-2 text-xl font-semibold">
                Email
              </span>
              <Input
                prefix={<MailOutlined />}
                placeholder="Email"
                size="large"
              />
            </div>
          </Form.Item>

          <Form.Item
            name="phoneNo"
            rules={[
              { required: true, message: "Please input your phone number!" },
            ]}
          >
            <div>
              <span className="block text-left mb-2 text-xl font-semibold">
                Phone Number
              </span>
              <Input
                prefix={<PhoneOutlined />}
                placeholder="Phone Number"
                size="large"
              />
            </div>
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
            hasFeedback
          >
            <div>
              <span className="block text-left mb-2 text-xl font-semibold">
                Password
              </span>
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
                size="large"
              />
            </div>
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={["password"]}
            hasFeedback
            rules={[
              { required: true, message: "Please confirm your password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The two passwords do not match!")
                  );
                },
              }),
            ]}
          >
            <div>
              <span className="block text-left mb-2 text-xl font-semibold">
                Confirm Password
              </span>
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Confirm Password"
                size="large"
              />
            </div>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              Sign Up
            </Button>
          </Form.Item>

          <Form.Item>
            <div style={{ textAlign: "center" }}>
              <span className="text-lg">Already have an account? </span>
              <a href="/login" className="text-lg">
                Log In
              </a>
            </div>
          </Form.Item>
        </Form>
      </div>

      {/* Modal */}
      <Modal
        title="Verify Your Email"
        open={isModalOpen} // Thay 'visible' thành 'open'
        onCancel={handleCancel}
        footer={null}
        centered
      >
        <p>Please enter the OTP sent to your email.</p>
        <Form onFinish={handleVerifyOTP}>
          <Form.Item
            name="otp"
            rules={[{ required: true, message: "Please input the OTP!" }]}
          >
            <Input placeholder="Enter OTP" size="large" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              Verify OTP
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SignupPage;
