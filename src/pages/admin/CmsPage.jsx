import { useState } from "react";
import React from "react";

import {
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  FileOutlined,
  ContainerOutlined,
  FlagOutlined,
  AppstoreAddOutlined,
} from "@ant-design/icons";
import { Button, Dropdown, Layout, Menu, theme } from "antd";
import { Avatar } from "antd";
import UseCookie from "../../hooks/UseCookie";
import { Outlet, useLocation, useNavigate } from "react-router";
const { Header, Content, Footer, Sider } = Layout;

const CmsPage = () => {
  const { removeToken } = UseCookie();
  const location = useLocation();
  const defaultKey = location.pathname.split("/")[2];
  const navigate = useNavigate();
  const handleLogout = () => {
    removeToken();
    localStorage.clear();
    navigate("/login");
  };
  const handleContents = (data) => {
    switch (data.key) {
      case "users":
        navigate(`/admin/${data.key}`);
        break;
      case "tickets":
        navigate(`/admin/${data.key}`);
        break;
      case "ticketproduct":
        navigate(`/admin/${data.key}`);
        break;
      case "report":
        navigate(`/admin/${data.key}`);
        break;

      default:
        break;
    }
  };
  function getItem(label, key, icon, children) {
    return {
      key,
      icon,
      children,
      label,
    };
  }
  const siderItems = [
    getItem("Manage account", "sub1", <UserOutlined />, [
      getItem("User", "users"),
    ]),
    getItem("Manage Ticket", "sub2", <AppstoreAddOutlined />, [
      getItem("Ticket", "tickets"),
      getItem("Ticket Product", "ticketproduct"),
    ]),
    getItem("Manage Report", "sub3", <AppstoreAddOutlined />, [
      getItem("Report", "report"),
    ]),
  ];
  const onClick = ({ key }) => {
    switch (key) {
      case "1":
        handleLogout();
        break;
      default:
        break;
    }
  };
  const items = [
    {
      label: "Log out",
      key: "1",
    },
  ];
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Layout className="absolute inset-0 w-full h-full ">
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={() => {}}
        onCollapse={() => {}}
        trigger={null}
        collapsible
        collapsed={collapsed}
      >
        <div className="demo-logo-vertical flex justify-center place-items-center relative w-full h-[150px] bg-slate-400 ">
          <p className="text-3xl">Hello Admin</p>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[defaultKey]}
          items={siderItems}
          onClick={(e) => handleContents(e)}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            background: colorBgContainer,
          }}
          className="flex items-center justify-between pl-4 pr-4 "
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
          <Dropdown
            menu={{
              items,
              onClick,
            }}
          >
            <a onClick={(e) => e.preventDefault()}>
              <Avatar
                size={{
                  xs: 40,
                  sm: 50,
                  md: 50,
                  lg: 50,
                  xl: 50,
                  xxl: 50,
                }}
                src="https://s3.ap-southeast-1.amazonaws.com/family.circle/avatar/AVATAR_tB5idnWvVj.jpg"
                className="cursor-pointer hover:opacity-60"
              />
            </a>
          </Dropdown>
        </Header>

        <Content
          style={{
            margin: "24px 16px 0",
            // overflow: "scroll",
          }}
        >
          {/* {params.id === "1" && <UsersContent bg={colorBgContainer} />}
          {params.id === "2" && <ExpertsContent bg={colorBgContainer} />}
          {params.id === "3" && <HospitalContent bg={colorBgContainer} />} */}
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default CmsPage;
