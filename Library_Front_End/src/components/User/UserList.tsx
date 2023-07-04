import { Button, Dropdown, Input, Pagination, Space, Table } from "antd";
import { ColumnsType, TableProps } from "antd/es/table";
import { useUsers } from "./useUsers";
import { useEffect, useState } from "react";
import { SorterResult, TablePaginationConfig } from "antd/es/table/interface";
import { Book } from "../Book/types";
import { LibraryUser } from "./types";
import { SearchOutlined } from "@ant-design/icons";

interface User {
  key: React.Key;
  id: number;
  username: string;
  createdBy: string;
  lastModifiedBy: string;
  creationDate: string;
  lastModifiedDate: string;
}

const UserList: React.FC = () => {
  const [tableData, setTableData] = useState<User[]>([]);

  const {
    totalUserNumber,
    users,
    error: bookError,
    setCurrentPage,
    currentPage,
    refetch,
    setSorterResult,
    setSearchColumn,
    setSearchValue,
  } = useUsers();

  useEffect(() => {
    refetch();
  }, []);

  const onSearch = (searchColumnName: string, searchValue: string) => {
    setSearchColumn(searchColumnName);
    setSearchValue(searchValue);
  };

  const columns: ColumnsType<User> = [
    {
      key: "id",
      title: "Id",
      dataIndex: "id",
      sorter: true,
      filterDropdown: ({ confirm }) => {
        return (
          <Input
            autoFocus
            placeholder="Search column"
            onChange={(e) => {
              onSearch("id", e.target.value);
            }}
            onPressEnter={() => confirm}
          />
        );
      },
      filterIcon: () => {
        return <SearchOutlined />;
      },
    },
    {
      key: "username",
      title: "Username",
      dataIndex: "username",
      sorter: true,
      filterDropdown: ({ confirm }) => {
        return (
          <Input
            autoFocus
            placeholder="Search column"
            onChange={(e) => {
              onSearch("username", e.target.value);
            }}
            onPressEnter={() => confirm}
          />
        );
      },
      filterIcon: () => {
        return <SearchOutlined />;
      },
    },
    {
      key: "createdBy",
      title: "Created By",
      dataIndex: "createdBy",
      sorter: true,
      filterDropdown: ({ confirm }) => {
        return (
          <Input
            autoFocus
            placeholder="Search column"
            onChange={(e) => {
              onSearch("createdBy", e.target.value);
            }}
            onPressEnter={() => confirm}
          />
        );
      },
      filterIcon: () => {
        return <SearchOutlined />;
      },
    },
    {
      key: "lastModifiedBy",
      title: "Last Modified By",
      dataIndex: "lastModifiedBy",
      sorter: true,
      filterDropdown: ({ confirm }) => {
        return (
          <Input
            autoFocus
            placeholder="Search column"
            onChange={(e) => {
              onSearch("lastModifiedBy", e.target.value);
            }}
            onPressEnter={() => confirm}
          />
        );
      },
      filterIcon: () => {
        return <SearchOutlined />;
      },
    },
    {
      key: "creationDate",
      title: "Creation Date",
      dataIndex: "creationDate",
      sorter: true,
      filterDropdown: ({ confirm }) => {
        return (
          <Input
            autoFocus
            placeholder="Search column"
            onChange={(e) => {
              onSearch("creationDate", e.target.value);
            }}
            onPressEnter={() => confirm}
          />
        );
      },
      filterIcon: () => {
        return <SearchOutlined />;
      },
    },
    {
      key: "lastModifiedDate",
      title: "Last Modified Date",
      dataIndex: "lastModifiedDate",
      sorter: true,
      filterDropdown: ({ confirm }) => {
        return (
          <Input
            autoFocus
            placeholder="Search column"
            onChange={(e) => {
              onSearch("lastModifiedDate", e.target.value);
            }}
            onPressEnter={() => confirm}
          />
        );
      },
      filterIcon: () => {
        return <SearchOutlined />;
      },
    },
  ];

  useEffect(() => {
    setTableData(
      users.map((user) => ({
        key: user.id,
        ...user,
        createdBy: user.createdBy ? user.createdBy : "No one",
        lastModifiedBy: user.lastModifiedBy ? user.lastModifiedBy : "No one",
        creationDate: user.creationDate.toLocaleString(),
        lastModifiedDate: user.lastModifiedDate.toLocaleString(),
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

  const onChange: TableProps<User>["onChange"] = (_, filter, sorter) => {
    const sorterResult = sorter as SorterResult<LibraryUser>;
    setSorterResult(sorterResult);
  };

  return (
    <>
      <div className="user-table-container">
        <Table<User>
          columns={columns}
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
