import React, { useState } from "react";
import { Form, Input, Button, Modal, message } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { confirmResetPasswordApi, resetPasswordApi } from "../../api/account";
import { useNavigate } from "react-router";

const ForgetPassword = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idHash, setIdHash] = useState(null);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const handleSendEmail = (values) => {
    setEmail(values.email);
    resetPasswordApi({ email: values.email })
      .then((res) => {
        setIdHash(res?.data?.idHash);
        setIsModalOpen(true);
        message.success("OTP has been sent to your email.");
      })
      .catch((err) => {
        message.error("Failed to send OTP: " + err.message);
      });
  };

  const handleConfirmReset = (values) => {
    const params = {
      otp: values.otp,
      idHash,
      newPassword: values.newPassword,
    };

    confirmResetPasswordApi(params)
      .then(() => {
        message.success("Password reset successfully!");
        setIsModalOpen(false);
        navigate("/login");
      })
      .catch((err) => {
        message.error("Failed to reset password: " + err.message);
      });
  };

  return (
    <div className="w-full h-screen flex justify-center items-center flex-col px-4">
      <div className="sm:w-[400px] w-full p-8 rounded-xl bg-white shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>
        <Form form={form} onFinish={handleSendEmail}>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please enter your email!" },
              { type: "email", message: "Invalid email format!" },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Enter your email"
              size="large"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              Send OTP
            </Button>
          </Form.Item>
        </Form>
      </div>

      {/* OTP Modal */}
      <Modal
        title="Reset Password"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        centered
      >
        <Form onFinish={handleConfirmReset}>
          <Form.Item
            name="otp"
            rules={[{ required: true, message: "Please enter the OTP" }]}
          >
            <Input placeholder="OTP" size="large" />
          </Form.Item>
          <Form.Item
            name="newPassword"
            rules={[{ required: true, message: "Please enter a new password" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="New Password"
              size="large"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              Confirm Reset
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ForgetPassword;
