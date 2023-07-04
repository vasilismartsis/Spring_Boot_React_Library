import React, { useEffect, useState } from "react";
import axios from "axios";
import { LoginAuthResponse, LoginForm } from "./types";
import { Button, Form, Input, Select, message } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { useLogin } from "./useLogin";
import { QueryClient, QueryClientProvider } from "react-query";
import { stringify } from "querystring";
import { error } from "console";

function Login() {
  const { doLogin, form } = useLogin();

  const onFinish = (values: LoginForm) => {
    doLogin(values, onSuccess, onError);
  };

  const onSuccess = () => {
    message.success(
      <span style={{ fontSize: "30px" }}>You have succesfully logged in!</span>
    );

    window.location.replace("/");
  };

  const onError = (error: string) => {
    message.error(
      <span style={{ fontSize: "30px" }}>Login Failed: {error}</span>
    );
  };

  const onFinishFailed = (errorInfo: any) => {
    message.info(
      <span style={{ fontSize: "30px" }}>
        "Please input correct values in the fields!"
      </span>
    );
  };

  return (
    <>
      <h1 className="table-label">Login</h1>

      <Form
        size="large"
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{
          maxWidth: 600,
          marginLeft: "28%",
          marginTop: "7%",
        }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        form={form}
      >
        <Form.Item
          label={<a style={{ fontSize: "x-large" }}>Username</a>}
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input placeholder="input username" />
        </Form.Item>

        <Form.Item
          label={<a style={{ fontSize: "x-large" }}>Password</a>}
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password
            placeholder="input password"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />
        </Form.Item>

        <Form.Item
          wrapperCol={{ offset: 14, span: 16 }}
          style={{ marginTop: "15%" }}
        >
          <Button type="primary" htmlType="submit">
            Login
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}

export default Login;
