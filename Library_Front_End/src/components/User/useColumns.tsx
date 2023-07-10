import { Typography, Popconfirm, Form, Input, Select, message } from "antd";
import { ColumnsType } from "antd/es/table";
import { LibraryUser } from "./types";
import { useState } from "react";
import { useUsers } from "./useUsers";
import { SearchOutlined } from "@ant-design/icons";
import TableInput from "./TableInput";
import TableSelect from "./TableSelect";

export interface useColumnsState {
  mergedColumns: ColumnsType<LibraryUser>;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setIsAdding: React.Dispatch<React.SetStateAction<boolean>>;
  setEditedId: React.Dispatch<React.SetStateAction<number | undefined>>;
  setEditedUser: React.Dispatch<React.SetStateAction<LibraryUser | undefined>>;
}

export const useColumns: () => useColumnsState = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isAdding, setIsAdding] = useState<boolean>(false);
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
    doAddUser,
    setSelectedRoles,
  } = useUsers();

  const columns = [
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
      editable: true,
      searchable: true,
      sortable: true,
    },
    {
      key: "password",
      title: "Password",
      dataIndex: "password",
      editable: true,
      searchable: true,
      sortable: true,
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
      editable: true,
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
        return isEditing && editedId == record.id ? (
          <span>
            <Typography.Link
              onClick={() => {
                if (editedUser) {
                  isAdding ? add(editedUser) : save(editedUser);
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
              setEditedUser(record);
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
    if (isEditing) {
      if (col.editable) {
        return {
          ...col,
          render: (value: any, record: LibraryUser) => {
            if (editedId == record.id) {
              if (col.key == "roles") {
                return (
                  <TableSelect
                    record={record}
                    roles={roles}
                    setEditedUser={setEditedUser}
                  />
                );
              } else {
                return (
                  <TableInput
                    colKey={String(col.key)}
                    value={value}
                    editedUser={editedUser}
                    setEditedUser={setEditedUser}
                  />
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
    }
  });

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

  const onUserUpdateSuccess = () => {
    setEditedId(-1);
    setIsEditing(false);
    setEditedUser(undefined);
    userRefetch();

    message.info(
      <span style={{ fontSize: "30px" }}>User updated successfully</span>
    );
  };
  const onUserUpdateError = (error: any) => {
    {
      message.info(
        <span style={{ fontSize: "30px" }}>Internal Error: {error}</span>
      );
    }
  };

  const add = (editedUser: LibraryUser) => {
    if (
      Object.values(editedUser).every(
        (value) => value !== "" && editedUser.roles.length > 0
      )
    ) {
      doAddUser(editedUser, onUserAddSuccess, onUserAddError);
    } else {
      message.info(
        <span style={{ fontSize: "30px" }}>
          Please complete all the fields!
        </span>
      );
    }
  };

  const onUserAddSuccess = () => {
    setEditedId(-1);
    setIsEditing(false);
    setEditedUser(undefined);
    userRefetch();

    message.info(
      <span style={{ fontSize: "30px" }}>User added successfully</span>
    );
  };
  const onUserAddError = (error: any) => {
    {
      message.info(
        <span style={{ fontSize: "30px" }}>Internal Error: {error}</span>
      );
    }
  };

  const onSearch = (searchColumnName: string, searchValue: string) => {
    setSearchColumn(searchColumnName);
    setSearchValue(searchValue);
  };

  return {
    mergedColumns,
    setIsEditing,
    setIsAdding,
    setEditedId,
    setEditedUser,
  };
};
