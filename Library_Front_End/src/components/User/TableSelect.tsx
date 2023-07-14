import { Form, Select } from "antd";
import React from "react";
import { LibraryUser } from "./types";

interface TableSelectProps {
  record: LibraryUser;
  roles: string[];
  editedUser: LibraryUser | undefined;
  setEditedUser: React.Dispatch<React.SetStateAction<LibraryUser | undefined>>;
}

const TableSelect: React.FC<TableSelectProps> = ({
  record,
  roles,
  editedUser,
  setEditedUser,
}) => {
  return (
    <Form>
      <Form.Item
        name={"roles"}
        initialValue={record.roles}
        style={{ margin: 0 }}
        rules={[
          {
            required: true,
            message: `Please Input roles!`,
          },
        ]}
      >
        <Select
          mode="multiple"
          allowClear
          style={{ width: "130px" }}
          placeholder="Please select"
          onChange={(e) => {
            setEditedUser({
              ...editedUser,
              roles: e,
            } as LibraryUser);
          }}
          options={roles.map((role) => ({
            label: role,
            value: role,
          }))}
        />
      </Form.Item>
    </Form>
  );
};

export default TableSelect;
