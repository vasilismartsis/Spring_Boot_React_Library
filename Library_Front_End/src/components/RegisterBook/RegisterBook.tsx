import { Button, Checkbox, Form, Input, Select, message } from "antd";
import { useEffect, useState } from "react";
import { useBookRegistration } from "./useBookRegistration";
import { useGenres } from "../Book/useGenres";

export interface RegisterBookProps {}

const RegisterBook: React.FC<RegisterBookProps> = (props) => {
  const { genres, error } = useGenres();

  const { doBookRegistration, form: registerBookForm } = useBookRegistration();

  const onFinish = (values: any) => {
    doBookRegistration(values, onSuccess, onError);
  };

  const onFinishFailed = (errorInfo: any) => {
    message.info(
      <span style={{ fontSize: "30px" }}>
        "Please input correct values in the fields!"
      </span>
    );
  };

  const onSuccess = () => {
    message.success(
      <span style={{ fontSize: "30px" }}>
        You successfully registered the new book!
      </span>
    );
  };

  const onError = (error: string) => {
    message.error(
      <span style={{ fontSize: "30px" }}>
        Book registration failed: {error}
      </span>
    );
  };

  const { Option } = Select;

  return (
    <>
      <h1 className="table-label">Register Book</h1>

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
        form={registerBookForm}
      >
        <Form.Item
          label={<a style={{ fontSize: "x-large" }}>Title</a>}
          name="bookTitle"
          rules={[{ required: true, message: "Please input book title!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={<a style={{ fontSize: "x-large" }}>Genre</a>}
          name="bookGenre"
          rules={[{ required: true, message: "Please input book genre!" }]}
        >
          <Select>
            {genres.map((genre) => (
              <Option key={genre} value={genre}>
                {genre}
              </Option>
            ))}
            Action
          </Select>
        </Form.Item>

        <Form.Item
          wrapperCol={{ offset: 14, span: 16 }}
          style={{ marginTop: "15%" }}
        >
          <Button type="primary" htmlType="submit">
            Register Book
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default RegisterBook;
