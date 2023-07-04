import { Breadcrumb, Layout, Menu, MenuProps, theme } from "antd";
import {
  BrowserRouter,
  Link,
  Outlet,
  Route,
  Router,
  Routes,
} from "react-router-dom";
import BookList from "../Book/BookList";
import Book from "../Book/Book";
import Sider from "antd/es/layout/Sider";
import { Header, Content, Footer } from "antd/es/layout/layout";
import { useState } from "react";

import {
  BookOutlined,
  SecurityScanOutlined,
  KeyOutlined,
} from "@ant-design/icons";

export interface ProfileProps {}

const Profile: React.FC = () => {
  type MenuItem = Required<MenuProps>["items"][number];

  function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[]
  ): MenuItem {
    return {
      key,
      icon,
      children,
      label,
    } as MenuItem;
  }

  const items: MenuItem[] = [
    getItem("Security", "security", <SecurityScanOutlined />, [
      getItem(
        <Link to="security">Change Password</Link>,
        "changePassword",
        <KeyOutlined />
      ),
    ]),
    getItem(
      <Link to="my-reservations">My Reservations</Link>,
      "myReservations",
      <BookOutlined />
    ),
  ];

  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        width={230}
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            textAlign: "center",
            minHeight: "15%",
            maxHeight: "15%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <h1 style={{ color: "green" }}>
            User: {sessionStorage.getItem("user")}
          </h1>
          <h2>Role: {sessionStorage.getItem("role")}</h2>
        </Header>
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }} />
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Profile;
