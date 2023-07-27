import React, { useEffect, useState } from "react";
import { Reservation, ReservationColumn } from "./types";
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
import { useReservations } from "./useReservations";
import pagination from "antd/es/pagination";
import { ColumnsType } from "antd/es/table";
import { SorterResult } from "antd/es/table/interface";
import { Book } from "../Book/types";
import { SearchOutlined } from "@ant-design/icons";
import { LibraryUser } from "../User/types";
import EditUser from "../User/EditUser";
import { useEditReservation } from "./useEditReservation";
import { useDeleteReservation } from "./useDeleteReservation";
import EditReservation from "./EditReservation";
import ExportCSVButton from "../TableExport/ExportCSVButton";
import { useExportCSV } from "../TableExport/useExportCSV";
import { useExportPDF } from "../TableExport/useExportPDF";
import ExportPDFButton from "../TableExport/ExportPDFButton";

export interface ReservationListProps {}

const ReservationList: React.FC<ReservationListProps> = (props) => {
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

  const {
    openEditReservationModal,
    editReservationForm,
    handleEditReservation,
    handleEditReservationOk,
    handleEditReservationCancel,
    onEditReservationFinish,
    onEditReservationFinishFailed,
    setOpenEditReservationModal,
    editedReservation,
    setEditedReservation,
  } = useEditReservation();
  const { handleDeleteReservationOk, setDeletedReservation } =
    useDeleteReservation();
  const { csvData } = useExportCSV(reservations);
  const { exportToPDF } = useExportPDF(reservations);

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
      key: "libraryUser",
      title: "User",
      dataIndex: "username",
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
      render: (_: any, record: Reservation) => {
        return (
          <>
            <Button
              style={{ borderColor: "blue", margin: "3px" }}
              onClick={() => {
                setEditedReservation(record);
                handleEditReservation();
              }}
            >
              Edit
            </Button>

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
                Delete
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
      <ExportCSVButton csvData={csvData}></ExportCSVButton>
      <ExportPDFButton exportToPDF={exportToPDF}></ExportPDFButton>
      <Table<Reservation>
        columns={enhancedColumns}
        dataSource={tableData}
        pagination={pagination}
        bordered={true}
        onChange={onChange}
      />
      <Modal
        key="editUserModal"
        title={<h1 className="table-label">Edit Reservation</h1>}
        open={openEditReservationModal}
        onOk={handleEditReservationOk}
        onCancel={handleEditReservationCancel}
      >
        <EditReservation
          form={editReservationForm}
          onFinish={onEditReservationFinish}
          onFinishFailed={onEditReservationFinishFailed}
          editedReservation={editedReservation}
        />
      </Modal>
    </>
  );
};

export default ReservationList;
