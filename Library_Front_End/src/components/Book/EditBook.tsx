import { Button, Checkbox, Form, Input, InputNumber, Select } from "antd";
import { FormInstance, useForm } from "antd/es/form/Form";
import React from "react";
import { Book, EditBookForm } from "./types";
const { Option } = Select;

interface editBookProps {
  genres: string[];
  form: FormInstance<EditBookForm>;
  onFinish: (values: any) => void;
  onFinishFailed: (errorInfo: any) => void;
  editedBook: Book;
}

const EditBook: React.FC<editBookProps> = ({
  genres,
  form,
  onFinish,
  onFinishFailed,
  editedBook,
}) => {
  return (
    <>
      <Form
        name="editBook"
        labelCol={{ span: 5 }}
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Please input title!" }]}
        >
          <Input placeholder="Input title" />
        </Form.Item>

        <Form.Item
          label="Quantity"
          name="quantity"
          initialValue={1}
          rules={[{ required: true, message: "Please input quantity!" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            min={0}
            placeholder="Input quantity"
          />
        </Form.Item>

        <Form.Item
          label="Genre"
          name="genre"
          rules={[{ required: true, message: "Please input genre!" }]}
        >
          <Select
            allowClear
            style={{ width: "100%" }}
            placeholder="Select genre"
            options={genres.map((genre) => ({
              label: genre,
              value: genre,
            }))}
          />
        </Form.Item>
      </Form>
    </>
  );
};

export default EditBook;
