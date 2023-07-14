import { Form, Input, Button, message } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useLogin } from "../../Login/useLogin";
import { useChangePassword } from "./useChangePassword";
import Login from "../../Login/Login";
import { ChangePasswordForm } from "./types";
import { LoginForm } from "../../Login/types";

const Security = () => {
  const { doChangePassword, form: ChangePasswordForm } = useChangePassword();

  const onFinish = (values: ChangePasswordForm) => {
    if (values.newPassword !== values.confirmNewPassword) {
      message.error(
        <span style={{ fontSize: "30px" }}>"Passwords do not match"</span>
      );
    } else if (!isValidPassword(values.newPassword)) {
      message.error(
        <span style={{ fontSize: "30px" }}>
          "Invalid password. It should contain at least 1 number, 1 character, 1
          special character, and be at least 8 characters long."
        </span>,
        5
      );
    } else {
      // New password is valid and matches the confirmation
      // Try to change password
      doChangePassword(values, onSuccess, onError);
    }
  };

  const onSuccess = () => {
    message.success(
      <span style={{ fontSize: "30px" }}>
        You successfully changed your password!
      </span>
    );
    ChangePasswordForm.resetFields();
  };

  const onError = (error: string) => {
    message.error(
      <span style={{ fontSize: "30px" }}>Password Change Failed: {error}</span>
    );
  };

  const onFinishFailed = (errorInfo: any) => {
    message.info(
      <span style={{ fontSize: "30px" }}>
        "Please input correct values in the fields!"
      </span>
    );
  };

  const isValidPassword = (value: string) => {
    // Password validation logic
    const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;
    return passwordRegex.test(value);
  };

  return (
    <>
      <Form
        size="large"
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{
          maxWidth: 600,
          marginLeft: "25%",
          marginTop: "3%",
        }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        form={ChangePasswordForm}
      >
        <h1 className="change-password-label">Change Password</h1>
        <Form.Item
          className="change-password-input-label"
          label={<a style={{ fontSize: "large" }}>Enter Current Password</a>}
          name="currentPassword"
          rules={[
            { required: true, message: "Please input your current password!" },
          ]}
        >
          <Input.Password
            className="change-password-input"
            placeholder="input current password"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />
        </Form.Item>
        <Form.Item
          label={<a style={{ fontSize: "large" }}>Enter New Password</a>}
          name="newPassword"
          rules={[
            { required: true, message: "Please input your new password!" },
            {
              validator: (_, value) => {
                if (value && !isValidPassword(value)) {
                  return Promise.reject(
                    "Invalid password. It should contain at least 1 number, 1 character, 1 special character, and be at least 8 characters long."
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input.Password
            className="change-password-input"
            placeholder="input new password"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />
        </Form.Item>

        <Form.Item
          label={<a style={{ fontSize: "large" }}>Confirm New Password</a>}
          name="confirmNewPassword"
          rules={[
            { required: true, message: "Please confirm your new password!" },
            {
              validator: (_, value) => {
                if (value && !isValidPassword(value)) {
                  return Promise.reject(
                    "Invalid password. It should contain at least 1 number, 1 character, 1 special character, and be at least 8 characters long."
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input.Password
            className="change-password-input"
            placeholder="confirm new password"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />
        </Form.Item>

        <Form.Item
          wrapperCol={{ offset: 14, span: 16 }}
          style={{ marginLeft: "-35%", marginTop: "12%" }}
        >
          <Button type="primary" htmlType="submit">
            Change Password
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default Security;
