import { Form, Input } from "antd";
import React from "react";
import { LibraryUser } from "./types";

interface TableInputProps {
  colKey: string;
  value: any;
  editedUser: LibraryUser | undefined;
  setEditedUser: React.Dispatch<React.SetStateAction<LibraryUser | undefined>>;
}

const TableInput: React.FC<TableInputProps> = ({
  colKey,
  value,
  editedUser,
  setEditedUser,
}) => {
  return (
    <Form>
      <Form.Item
        name={colKey}
        initialValue={value}
        style={{ margin: 0 }}
        rules={[
          {
            required: true,
            message: `Please Input ${colKey}!`,
          },
        ]}
      >
        <Input
          onChange={(e) => {
            setEditedUser({
              ...editedUser!,
              [colKey]: e.target.value,
            });
          }}
        />
      </Form.Item>
    </Form>
  );
};

export default TableInput;
