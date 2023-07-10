import {
  Button,
  Dropdown,
  Form,
  Input,
  Pagination,
  Popconfirm,
  Select,
  Space,
  Table,
  Typography,
  message,
} from "antd";
import { ColumnsType, TableProps } from "antd/es/table";
import { useUsers } from "./useUsers";
import { useColumns } from "./useColumns";
import { useEffect, useState } from "react";
import { SorterResult, TablePaginationConfig } from "antd/es/table/interface";
import { Book } from "../Book/types";
import { LibraryUser } from "./types";
import { SearchOutlined } from "@ant-design/icons";
import { merge } from "jquery";

const UserList: React.FC = () => {
  const [tableData, setTableData] = useState<LibraryUser[]>([]);

  const {
    totalUserNumber,
    users,
    setCurrentPage,
    currentPage,
    setSorterResult,
    setSelectedRoles,
  } = useUsers();

  const {
    mergedColumns,
    setIsEditing,
    setIsAdding,
    setEditedId,
    setEditedUser,
  } = useColumns();

  useEffect(() => {
    setTableData(
      users.map((user) => ({
        key: user.id,
        ...user,
        roles: user.roles,
        password: "******HIDDEN******",
        createdBy: user.createdBy ? user.createdBy : "No one",
        lastModifiedBy: user.lastModifiedBy ? user.lastModifiedBy : "No one",
      }))
    );
  }, [users]);

  const pagination: TablePaginationConfig = {
    position: ["bottomCenter"],
    onChange(page) {
      setCurrentPage(() => page);
    },
    pageSize: 5,
    current: currentPage,
    total: totalUserNumber,
    defaultCurrent: 1,
  };

  const onChange: TableProps<LibraryUser>["onChange"] = (_, filter, sorter) => {
    const sorterResult = sorter as SorterResult<LibraryUser>;
    setSorterResult(sorterResult);
    setSelectedRoles(
      (filter.roles as string[]) != null ? (filter.roles as string[]) : []
    );
  };

  const handleAdd = () => {
    const newLibraryUser = {
      key: 55,
      id: 55,
      username: "",
      password: "",
      roles: [],
      createdBy: sessionStorage["username"],
      lastModifiedBy: sessionStorage["username"],
      creationDate: new Date().toISOString(),
      lastModifiedDate: new Date().toISOString(),
    };

    setTableData([...tableData, newLibraryUser]);
    setEditedId(newLibraryUser.id);
    setEditedUser(newLibraryUser);
    setIsEditing(true);
    setIsAdding(true);
  };

  return (
    <>
      <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>
        Add a new user
      </Button>
      <Table<LibraryUser>
        columns={mergedColumns}
        dataSource={tableData}
        pagination={pagination}
        bordered={true}
        onChange={onChange}
      />
    </>
  );
};

export default UserList;
