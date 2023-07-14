import axios from "axios";
import { useEffect, useState } from "react";
import {
  AppstoreOutlined,
  MailOutlined,
  BookOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Divider, Menu } from "antd";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { hide, left } from "@popperjs/core";

export interface NavBarProps {}

const NavBar: React.FC<NavBarProps> = (props) => {
  const items: MenuProps["items"] = [
    {
      key: "image",
      icon: (
        <span>
          <a href="/" className="navbar-item">
            <img
              src="https://cdn-icons-png.flaticon.com/512/25/25694.png"
              style={{ width: "50px" }}
            />
          </a>
        </span>
      ),
    },
    {
      label: (
        <a href="/books" style={{ textDecoration: "none" }}>
          Books
        </a>
      ),
      key: "Books",
    },
    sessionStorage.getItem("role") == "ADMIN"
      ? {
          label: "Admin",
          key: "Admin",
          children: [
            {
              label: (
                <a href="/reservations" className="navbar-item">
                  Reservations
                </a>
              ),
              key: "reservations",
            },
            {
              label: (
                <a href="/users" className="navbar-item">
                  Users
                </a>
              ),
              key: "users",
            },
          ],
        }
      : null,
    !sessionStorage.getItem("username")
      ? {
          label: (
            <a style={{ textDecoration: "none" }} href="/login">
              Login
            </a>
          ),
          key: "Login",
          style: { float: "right" },
        }
      : {
          label: "My Account",
          key: "MyAccount",
          style: { float: "right" },
          children: [
            sessionStorage.getItem("username")
              ? {
                  label: (
                    <div className="navbar-title">
                      <u>{sessionStorage.getItem("username")}</u>
                      {" ("}
                      {sessionStorage.getItem("role")?.toLocaleLowerCase()}
                      {")"}
                    </div>
                  ),
                  key: "userName",
                  disabled: true,
                  style: { height: "60px" },
                }
              : null,
            sessionStorage.getItem("username")
              ? {
                  label: (
                    <a className="navbar-item" href="/profile">
                      Profile
                    </a>
                  ),
                  key: "Profile",
                }
              : null,
            {
              label: (
                <a
                  href="/login"
                  className="navbar-item"
                  onClick={() => sessionStorage.clear()}
                >
                  Logout
                </a>
              ),
              key: "Logout",
            },
          ],
        },
  ];

  const [click, setClick] = useState(0);
  const [current, setCurrent] = useState("");

  const onClick: MenuProps["onClick"] = (e) => {
    setCurrent(e.key);
  };

  return (
    <Menu
      onClick={onClick}
      selectedKeys={[current]}
      mode="horizontal"
      items={items}
      style={{
        fontSize: "30px",
        verticalAlign: "center",
        backgroundColor: "rgb(240, 245, 247)",
        display: "block",
      }}
      className="stick-to-the-top"
    />
  );
};

export default NavBar;
