import React, { useEffect, useState } from "react";
import { Reservation } from "./types";
import {
  Input,
  Pagination,
  Space,
  Table,
  TablePaginationConfig,
  TableProps,
  message,
} from "antd";
import { useReservations } from "./useReservations";
import pagination from "antd/es/pagination";
import { ColumnsType } from "antd/es/table";
import { SorterResult } from "antd/es/table/interface";
import { Book } from "../Book/types";
import { SearchOutlined } from "@ant-design/icons";

export interface ReservationListProps {}

const ReservationList: React.FC<ReservationListProps> = (props) => {
  const [tableData, setTableData] = useState<Reservation[]>([]);

  const {
    totalReservationNumber,
    reservations,
    setCurrentPage,
    currentPage,
    error,
    refetch,
    setSorterResult,
    setSearchColumn,
    setSearchValue,
  } = useReservations();

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (!!error) {
      message.info(
        <span style={{ fontSize: "30px" }}>
          "There was an error on the server. Please reload the page! Error:{" "}
          {error}"
        </span>
      );
    }
  }, [error]);

  const onSearch = (searchColumnName: string, searchValue: string) => {
    setSearchColumn(searchColumnName);
    setSearchValue(searchValue);
  };

  const columns: ColumnsType<Reservation> = [
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
      key: "libraryUser",
      title: "username",
      dataIndex: "username",
      sorter: true,
      filterDropdown: ({ confirm }) => {
        return (
          <Input
            autoFocus
            placeholder="Search column"
            onChange={(e) => {
              onSearch("libraryUser", e.target.value);
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
      key: "bookTitle",
      title: "Book Title",
      dataIndex: "bookTitle",
      sorter: true,
      filterDropdown: ({ confirm }) => {
        return (
          <Input
            autoFocus
            placeholder="Search column"
            onChange={(e) => {
              onSearch("book", e.target.value);
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
      key: "reservationDate",
      title: "Reservation Date",
      dataIndex: "reservationDate",
      sorter: true,
      filterDropdown: ({ confirm }) => {
        return (
          <Input
            autoFocus
            placeholder="Search column"
            onChange={(e) => {
              onSearch("reservationDate", e.target.value);
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
      key: "expirationDate",
      title: "Expiration Date",
      dataIndex: "expirationDate",
      sorter: true,
      filterDropdown: ({ confirm }) => {
        return (
          <Input
            autoFocus
            placeholder="Search column"
            onChange={(e) => {
              onSearch("expirationDate", e.target.value);
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
      reservations.map((reservation) => ({
        key: reservation.id,
        ...reservation,
        createdBy: reservation.createdBy ? reservation.createdBy : "No one",
        lastModifiedBy: reservation.lastModifiedBy
          ? reservation.lastModifiedBy
          : "No one",
      }))
    );
  }, [reservations]);

  const pagination: TablePaginationConfig = {
    position: ["bottomCenter"],
    onChange(page) {
      setCurrentPage(() => page);
    },
    pageSize: 5,
    current: currentPage,
    total: totalReservationNumber,
    defaultCurrent: 1,
  };

  const onChange: TableProps<Reservation>["onChange"] = (_, filter, sorter) => {
    const sorterResult = sorter as SorterResult<Reservation>;
    console.log(sorterResult);
    setSorterResult(sorterResult);
  };

  return (
    <>
      <Table<Reservation>
        columns={columns}
        dataSource={tableData}
        pagination={pagination}
        bordered={true}
        onChange={onChange}
      />
    </>
  );
};

export default ReservationList;
