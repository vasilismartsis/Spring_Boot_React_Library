import axios, { AxiosResponse } from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { Button, Dropdown, MenuProps, Pagination, Space, message } from "antd";
import { DownOutlined, UserOutlined } from "@ant-design/icons";

import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
  useQuery,
} from "react-query";
import { LibraryUser, UserResource } from "./types";
import { SorterResult } from "antd/es/table/interface";

export interface UsersState {
  totalUserNumber: number;
  users: LibraryUser[];
  error?: any;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  currentPage: number;
  refetch: () => void;
  setSorterResult: React.Dispatch<
    React.SetStateAction<SorterResult<LibraryUser>>
  >;
  setSearchColumn: React.Dispatch<React.SetStateAction<string>>;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
}

export const useUsers: () => UsersState = () => {
  const [totalUserNumber, setTotalUserNumber] = useState<number>(0);
  const [users, setUsers] = useState<LibraryUser[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sorterResult, setSorterResult] = useState<SorterResult<LibraryUser>>(
    {}
  );
  const [searchColumn, setSearchColumn] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");

  const getUsers = () => {
    return axios.get(
      `http://localhost:8080/api/user/getUsers?&page=${currentPage}&order=${sorterResult.order}&sortedColumn=${sorterResult.field}&searchColumn=${searchColumn}&searchValue=${searchValue}`,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
  };

  const { error, refetch } = useQuery("getUsers", getUsers, {
    enabled: false,
    onSuccess: (res) => {
      setTotalUserNumber(
        () => (res.data as UserResource).totalLibraryUserNumber
      );
      setUsers(() => (res.data as UserResource).singleLibraryUserResponse);
    },
  });

  useEffect(() => {
    refetch();
  }, [currentPage, sorterResult, searchValue, searchColumn]);

  return {
    totalUserNumber,
    users,
    error,
    setCurrentPage,
    currentPage,
    refetch,
    setSorterResult,
    setSearchColumn,
    setSearchValue,
  };
};
