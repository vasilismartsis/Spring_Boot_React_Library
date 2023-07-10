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
import { useEffect, useState } from "react";
import { SorterResult, TablePaginationConfig } from "antd/es/table/interface";
import { Book } from "../Book/types";
import { LibraryUser } from "./types";
import { SearchOutlined } from "@ant-design/icons";
import { merge } from "jquery";

const UserList: React.FC = () => {
  const [tableData, setTableData] = useState<LibraryUser[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [test, setTest] = useState<string>("");
  const [editedId, setEditedId] = useState<number>();
  const [editedUser, setEditedUser] = useState<LibraryUser>();

  const {
    totalUserNumber,
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
    doUpdateUser,
    setSelectedRoles,
  } = useUsers();

  const onSearch = (searchColumnName: string, searchValue: string) => {
    setSearchColumn(searchColumnName);
    setSearchValue(searchValue);
  };

  const columns: ColumnsType<LibraryUser> = [
    {
      key: "id",
      title: "Id",
      dataIndex: "id",
    },
    {
      key: "username",
      title: "Username",
      dataIndex: "username",
    },
    {
      key: "password",
      title: "Password",
      dataIndex: "password",
    },
    {
      key: "roles",
      title: "Roles",
      dataIndex: "roles",
      filters: !isEditing
        ? roles.map((role) => ({
            text: role,
            value: role,
          }))
        : undefined,
      filterSearch: true,
    },
    {
      key: "createdBy",
      title: "Created By",
      dataIndex: "createdBy",
    },
    {
      key: "lastModifiedBy",
      title: "Last Modified By",
      dataIndex: "lastModifiedBy",
    },
    {
      key: "creationDate",
      title: "Creation Date",
      dataIndex: "creationDate",
    },
    {
      key: "lastModifiedDate",
      title: "Last Modified Date",
      dataIndex: "lastModifiedDate",
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: LibraryUser) => {
        return isEditing && editedId == record.id ? (
          <span>
            <Typography.Link
              onClick={() => {
                if (editedUser) {
                  save(editedUser);
                }
              }}
              style={{ marginRight: 8 }}
            >
              Save
            </Typography.Link>
            <Popconfirm
              title="Sure to cancel?"
              onConfirm={() => {
                setEditedId(-1);
                setIsEditing(false);
                setEditedUser(undefined);
              }}
            >
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link
            onClick={() => {
              setEditedId(record.id);
              setIsEditing(true);
            }}
          >
            Edit
          </Typography.Link>
        );
      },
    },
  ];

  const mergedColumns: ColumnsType<LibraryUser> = columns.map((col) => {
    const editable: boolean =
      col.key == "username" || col.key == "password" || col.key == "roles";
    const searchable: boolean = col.key != "action" && col.key != "roles";
    const sortable: boolean = col.key != "action";

    if (isEditing) {
      if (editable) {
        return {
          ...col,
          render: (value: any, record: LibraryUser) => {
            if (editedId == record.id) {
              if (col.key == "roles") {
                return (
                  <Form>
                    <Form.Item
                      name={"roles"}
                      initialValue={record.roles}
                      style={{ margin: 0 }}
                      rules={[
                        {
                          required: true,
                          message: `Please Input ${col.key}!`,
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
                            ...record,
                            [String(col.key)]: e,
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
              } else {
                return (
                  <Form>
                    <Form.Item
                      name={"babis"}
                      initialValue={value}
                      style={{ margin: 0 }}
                      rules={[
                        {
                          required: true,
                          message: `Please Input ${col.key}!`,
                        },
                      ]}
                    >
                      <Input
                        onChange={(e) => {
                          setEditedUser({
                            ...record,
                            [String(col.key)]: e.target.value,
                          } as LibraryUser);
                        }}
                      />
                    </Form.Item>
                  </Form>
                );
              }
            } else {
              return value;
            }
          },
        };
      } else {
        return {
          ...col,
          filterDropdown: false,
          sorter: false,
          filters: undefined,
          filterSearch: false,
          filterIcon: false,
        };
      }
    } else {
      return {
        ...col,
        sorter: sortable ? true : false,
        filterDropdown: searchable
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
        filterIcon: searchable
          ? () => {
              return <SearchOutlined />;
            }
          : false,
      };
    }
  });

  const onUserUpdateSuccess = () => {
    setEditedId(-1);
    setIsEditing(false);
    setEditedUser(undefined);
    userRefetch();
  };
  const onUserUpdateError = (error: any) => {
    {
      message.info(
        <span style={{ fontSize: "30px" }}>Internal Error: {error}</span>
      );
    }
  };

  const save = (editedUser: LibraryUser) => {
    if (
      Object.values(editedUser).every(
        (value) => value !== "" && editedUser.roles.length > 0
      )
    ) {
      doUpdateUser(editedUser, onUserUpdateSuccess, onUserUpdateError);
    } else {
      message.info(
        <span style={{ fontSize: "30px" }}>
          Please complete all the fields!
        </span>
      );
    }
  };

  useEffect(() => {
    setTableData(
      users.map((user) => ({
        key: user.id,
        ...user,
        roles: user.roles,
        password: "**************",
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

  return (
    <>
      <div className="user-table-container">
        <Table<LibraryUser>
          columns={mergedColumns}
          dataSource={tableData}
          pagination={pagination}
          bordered={true}
          onChange={onChange}
        />
      </div>
    </>
  );
};

export default UserList;
