import React, { useEffect, useState } from "react";
import {
  Button,
  Input,
  Modal,
  Pagination,
  Popconfirm,
  Space,
  Table,
  TablePaginationConfig,
  TableProps,
  message,
} from "antd";
import pagination from "antd/es/pagination";
import { ColumnsType } from "antd/es/table";
import { SorterResult } from "antd/es/table/interface";
import { SearchOutlined } from "@ant-design/icons";
import { Reservation, ReservationColumn } from "../../Reservation/types";
import { useReservations } from "../../Reservation/useReservations";
import { useDeleteReservation } from "../../Reservation/useDeleteReservation";

export interface MyReservationListProps {}

const MyReservationList: React.FC<MyReservationListProps> = (props) => {
  const [tableData, setTableData] = useState<Reservation[]>([]);

  const {
    totalReservationNumber,
    reservations,
    setCurrentPage,
    currentPage,
    error,
    reservationRefetch,
    setSorterResult,
    setSearchColumn,
    setSearchValue,
    doEditReservation,
    doDeleteReservation,
  } = useReservations();

  const { handleDeleteReservationOk, setDeletedReservation } =
    useDeleteReservation();

  useEffect(() => {
    reservationRefetch();
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
      key: "book",
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
      title: "Action",
      key: "action",
      render: (_: any, record: Reservation) => {
        return (
          <>
            <Popconfirm
              title="Delete User"
              description="Are you sure to delete this user?"
              onConfirm={handleDeleteReservationOk}
              okText="Yes"
              cancelText="No"
            >
              <Button
                style={{ margin: "3px" }}
                danger
                onClick={() => {
                  setDeletedReservation(record);
                }}
              >
                Return Book
              </Button>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  const enhancedColumns: ColumnsType<Reservation> = columns.map((col) => {
    const columnType =
      reservations.length > 0
        ? typeof (reservations[0] as any)[String(col.dataIndex)]
        : "string";

    return {
      ...col,
      width: 1,
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

export default MyReservationList;
