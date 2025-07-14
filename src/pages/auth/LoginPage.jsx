import React from "react";
import { Form, Input, Button, Row, Col, Checkbox } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import useAccountMutate from "../../hooks/useMutate/useAccountMutate";
import { useNavigate } from "react-router";
import getToken from "../../hooks/UseCookie";

const LoginPage = () => {
  const { handleLogin } = useAccountMutate();
  const navigate = useNavigate();
  const { access_token, refresh_token } = getToken();
  const onFinish = (values) => {
    const newValues = {
      username: values.username,
      password: values.password,
    };
    handleLogin(newValues).then((res) => {
      localStorage.setItem("accessToken", JSON.stringify(res.data.data.accessToken));
      localStorage.setItem("userKind", JSON.stringify(res.data.data.kind));
 
    });
  };

  return (
    <div className="w-full h-screen flex justify-center items-center flex-col desktop:px-auto px-4">
      <div className="sm:w-[500px] h-[500px] w-full p-8 rounded-2xl bg-[#FFFFFF] flex flex-col shadow-lg">
        <Form
          name="login"
          onFinish={onFinish}
          initialValues={{
            remember: true,
          }}
        >
          {/* Email Field */}
          <span className="block text-left mb-2 text-xl font-semibold">
            Username
          </span>
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your email!",
                type: "username",
              },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="User Name" size="large" />
          </Form.Item>

          {/* Password Field */}
          <span className="block text-left mb-2 text-xl font-semibold">
            Password
          </span>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>

          {/* Remember me and Forgot password */}
          <Form.Item>
            <Row justify="space-between">
              <Col>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox className="text-lg">Remember me</Checkbox>
                </Form.Item>
              </Col>
              <Col>
                <a href="/forgotpassword" className="text-lg">
                  Forgot Password?
                </a>
              </Col>
            </Row>
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              Log in
            </Button>
          </Form.Item>

          {/* Sign Up Link */}
          <Form.Item>
            <div style={{ textAlign: "center" }}>
              <span className="text-lg">Don't have an account? </span>
              <a href="/signup" className="text-lg">
                Sign Up
              </a>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
