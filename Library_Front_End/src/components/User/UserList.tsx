import {
  Button,
  Dropdown,
  Form,
  Input,
  Modal,
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
import { useContext, useEffect, useRef, useState } from "react";
import { SorterResult, TablePaginationConfig } from "antd/es/table/interface";
import { Book } from "../Book/types";
import { AddUserForm, EditUserForm, LibraryUser, UserColumn } from "./types";
import { SearchOutlined } from "@ant-design/icons";
import { merge } from "jquery";
import AddUser from "./AddUser";
import { useForm } from "antd/es/form/Form";
import EditUser from "./EditUser";
import { useAddUser } from "./useAddUser";
import { useEditUser } from "./useEditUser";
import type { DraggableData, DraggableEvent } from "react-draggable";
import Draggable from "react-draggable";
import { useDeleteUser } from "./useDeleteUser";
import { UserContext } from "./UserContext";

const UserList: React.FC = () => {
  const [tableData, setTableData] = useState<LibraryUser[]>([]);

  const {
    totalUsers,
    users,
    userError,
    roles,
    roleError,
    roleRefetch,
    setCurrentPage,
    currentPage,
    userRefetch,
    setSorterResult,
    setSearchColumn,
    setSearchValue,
    doEditUser,
    doAddUser,
    doDeleteUser,
    setSelectedRoles,
  } = useContext(UserContext);

  const {
    openAddUserModal,
    addUserForm,
    handleAddUser,
    handleAddUserOk,
    handleAddUserCancel,
    onAddUserFinish,
    onAddUserFinishFailed,
  } = useAddUser();

  const {
    openEditUserModal,
    editUserForm,
    handleEditUser,
    handleEditUserOk,
    handleEditUserCancel,
    onEditUserFinish,
    onEditUserFinishFailed,
    editedUser,
    setEditedUser,
  } = useEditUser();

  const { handleDeleteUserOk, setDeletedUser } = useDeleteUser();

  const columns: UserColumn[] = [
    {
      key: "id",
      title: "Id",
      dataIndex: "id",
      searchable: true,
      sortable: true,
    },
    {
      key: "username",
      title: "Username",
      dataIndex: "username",
      searchable: true,
      sortable: true,
    },
    {
      key: "roles",
      title: "Roles",
      dataIndex: "roles",
      filters: roles.map((role) => ({
        text: role,
        value: role,
      })),
      filterSearch: true,
      sortable: true,
    },
    {
      key: "createdBy",
      title: "Created By",
      dataIndex: "createdBy",
      searchable: true,
      sortable: true,
    },
    {
      key: "lastModifiedBy",
      title: "Last Modified By",
      dataIndex: "lastModifiedBy",
      searchable: true,
      sortable: true,
    },
    {
      key: "creationDate",
      title: "Creation Date",
      dataIndex: "creationDate",
      searchable: true,
      sortable: true,
    },
    {
      key: "lastModifiedDate",
      title: "Last Modified Date",
      dataIndex: "lastModifiedDate",
      searchable: true,
      sortable: true,
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: LibraryUser) => {
        return (
          <>
            <Button
              style={{ borderColor: "blue", margin: "3px" }}
              onClick={() => {
                setEditedUser(record);
                handleEditUser();
              }}
            >
              Edit
            </Button>

            <Popconfirm
              title="Delete User"
              description="Are you sure to delete this user?"
              onConfirm={handleDeleteUserOk}
              okText="Yes"
              cancelText="No"
            >
              <Button
                style={{ margin: "3px" }}
                danger
                onClick={() => {
                  setDeletedUser(record);
                }}
              >
                Delete
              </Button>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  const enhancedColumns: ColumnsType<LibraryUser> = columns.map((col) => {
    const columnType =
      users.length > 0
        ? typeof (users[0] as any)[String(col.dataIndex)]
        : "string";

    return {
      ...col,
      width: 200,
      align: columnType == "number" ? "right" : "left",
      sorter: col.sortable ? true : false,
      filterDropdown: col.searchable
        ? ({ confirm }) => {
            return (
              <Input
                autoFocus
                placeholder="Search column"
                onChange={(e) => {
                  onSearch(String(col.key), e.target.value);
                }}
                onPressEnter={() => confirm}
              />
            );
          }
        : false,
      filterIcon: col.searchable
        ? () => {
            return <SearchOutlined />;
          }
        : false,
    };
  });

  const onSearch = (searchColumnName: string, searchValue: string) => {
    setSearchColumn(searchColumnName);
    setSearchValue(searchValue);
  };

  useEffect(() => {
    setTableData(
      users.map((user) => ({
        key: user.id,
        ...user,
        roles: user.roles,
        createdBy: user.createdBy ? user.createdBy : "System",
        lastModifiedBy: user.lastModifiedBy ? user.lastModifiedBy : "System",
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
    total: totalUsers,
    defaultCurrent: 1,
  };

  const onChange: TableProps<LibraryUser>["onChange"] = (_, filter, sorter) => {
    const sorterResult = sorter as SorterResult<LibraryUser>;
    setSorterResult(sorterResult);
    setSelectedRoles(
      (filter.roles as string[]) != null ? (filter.roles as string[]) : []
    );
  };

  return (
    <>
      <Button
        onClick={handleAddUser}
        type="primary"
        style={{ marginBottom: 16 }}
      >
        Add a new user
      </Button>
      <Table<LibraryUser>
        columns={enhancedColumns}
        dataSource={tableData}
        pagination={pagination}
        bordered={true}
        onChange={onChange}
      />
      <Modal
        title={<h1 className="table-label">Add User</h1>}
        open={openAddUserModal}
        onOk={handleAddUserOk}
        onCancel={handleAddUserCancel}
      >
        <AddUser
          roles={roles}
          form={addUserForm}
          onFinish={onAddUserFinish}
          onFinishFailed={onAddUserFinishFailed}
        />
      </Modal>
      <Modal
        key="editUserModal"
        title={<h1 className="table-label">Edit User</h1>}
        open={openEditUserModal}
        onOk={handleEditUserOk}
        onCancel={handleEditUserCancel}
      >
        <EditUser
          roles={roles}
          form={editUserForm}
          onFinish={onEditUserFinish}
          onFinishFailed={onEditUserFinishFailed}
          editedUser={editedUser}
        />
      </Modal>
    </>
  );
};

export default UserList;
