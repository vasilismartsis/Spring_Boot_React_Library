import { Button, Checkbox, Form, Input, Select } from "antd";
import { FormInstance, useForm } from "antd/es/form/Form";
import React from "react";
import { RegisterBookForm } from "../RegisterBook/types";
import { AddUserForm } from "./types";
import { useEditUser } from "./useEditUser";
const { Option } = Select;

interface addUserProps {
  roles: string[];
  form: FormInstance<AddUserForm>;
  onFinish: (values: any) => void;
  onFinishFailed: (errorInfo: any) => void;
}

const AddUser: React.FC<addUserProps> = ({
  roles,
  form,
  onFinish,
  onFinishFailed,
}) => {
  return (
    <>
      <Form
        name="addUser"
        labelCol={{ span: 5 }}
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please input username!" }]}
        >
          <Input placeholder="Input username" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input password!" }]}
        >
          <Input.Password placeholder="Input password" />
        </Form.Item>

        <Form.Item
          label="Roles"
          name="roles"
          rules={[{ required: true, message: "Please input role!" }]}
        >
          <Select
            mode="multiple"
            allowClear
            style={{ width: "100%" }}
            placeholder="Select roles"
            options={roles.map((role) => ({
              label: role,
              value: role,
            }))}
          />
        </Form.Item>
      </Form>
    </>
  );
};

export default AddUser;
