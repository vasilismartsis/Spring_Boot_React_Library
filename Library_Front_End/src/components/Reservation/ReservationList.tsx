import React, { useEffect, useState } from "react";
import { Reservation, ReservationColumn } from "./types";
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

  const columns: ReservationColumn[] = [
    {
      key: "id",
      title: "Id",
      dataIndex: "id",
      searchable: true,
      sortable: true,
    },
    {
      key: "libraryUser",
      title: "username",
      dataIndex: "username",
      searchable: true,
      sortable: true,
    },
    {
      key: "bookTitle",
      title: "Book Title",
      dataIndex: "bookTitle",
      searchable: true,
      sortable: true,
    },
    {
      key: "reservationDate",
      title: "Reservation Date",
      dataIndex: "reservationDate",
      searchable: true,
      sortable: true,
    },
    {
      key: "expirationDate",
      title: "Expiration Date",
      dataIndex: "expirationDate",
      searchable: true,
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
  ];

  const enhancedColumns: ColumnsType<Reservation> = columns.map((col) => {
    const columnType =
      reservations.length > 0
        ? typeof (reservations[0] as any)[String(col.dataIndex)]
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

  useEffect(() => {
    setTableData(
      reservations.map((reservation) => ({
        key: reservation.id,
        ...reservation,
        createdBy: reservation.createdBy ? reservation.createdBy : "System",
        lastModifiedBy: reservation.lastModifiedBy
          ? reservation.lastModifiedBy
          : "System",
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
        columns={enhancedColumns}
        dataSource={tableData}
        pagination={pagination}
        bordered={true}
        onChange={onChange}
      />
    </>
  );
};

export default ReservationList;
