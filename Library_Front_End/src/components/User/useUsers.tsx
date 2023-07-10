import axios, { AxiosResponse } from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { Button, Dropdown, MenuProps, Pagination, Space, message } from "antd";
import { DownOutlined, UserOutlined } from "@ant-design/icons";

import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
  useMutation,
  useQuery,
} from "react-query";
import { LibraryUser, UserResource } from "./types";
import { SorterResult } from "antd/es/table/interface";

export interface UsersState {
  totalUserNumber: number;
  users: LibraryUser[];
  userError?: any;
  roles: string[];
  roleError?: any;
  roleRefetch: () => void;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  currentPage: number;
  userRefetch: () => void;
  setSorterResult: React.Dispatch<
    React.SetStateAction<SorterResult<LibraryUser>>
  >;
  setSearchColumn: React.Dispatch<React.SetStateAction<string>>;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  doUpdateUser: (
    data: LibraryUser,
    onSuccess: () => void,
    onError: (error: string) => void
  ) => void;
  setSelectedRoles: React.Dispatch<React.SetStateAction<string[]>>;
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
  const [roles, setRoles] = useState<string[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  //Get user
  const getUsers = () => {
    const currentURL = window.location.href;
    const ip = new URL(currentURL).hostname;
    return axios.get(
      `http://${ip}:8080/api/user/getUsers?selectedRoles=${selectedRoles}&page=${currentPage}&order=${sorterResult.order}&sortedColumn=${sorterResult.field}&searchColumn=${searchColumn}&searchValue=${searchValue}`,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
  };

  const { error: userError, refetch: userRefetch } = useQuery(
    "getUsers",
    getUsers,
    {
      enabled: false,
      onSuccess: (res) => {
        setTotalUserNumber(
          () => (res.data as UserResource).totalLibraryUserNumber
        );
        setUsers(() => (res.data as UserResource).singleLibraryUserResponse);
      },
    }
  );

  useEffect(() => {
    userRefetch();
  }, [currentPage, sorterResult, searchValue, searchColumn, selectedRoles]);

  //Get roles
  const getRoles = () => {
    const currentURL = window.location.href;
    const ip = new URL(currentURL).hostname;
    return axios.get(`http://${ip}:8080/api/user/getRoles`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
  };

  const { error: roleError, refetch: roleRefetch } = useQuery(
    "getRoles",
    getRoles,
    {
      enabled: false,
      onSuccess: (res) => {
        setRoles(res.data);
      },
    }
  );

  useEffect(() => {
    roleRefetch();
  }, []);

  //Update user
  const postUpdateUser = (values: LibraryUser) => {
    const currentURL = window.location.href;
    const ip = new URL(currentURL).hostname;
    return axios.post(`http://${ip}:8080/api/user/updateUser`, values, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
  };

  const userUpdateMutation = useMutation("updateUserQuery", postUpdateUser);

  const doUpdateUser = (
    values: LibraryUser,
    onSuccess: () => void,
    onError: (error: string) => void
  ) => {
    userUpdateMutation.mutate(values, {
      onSuccess,
      onError: (error) => {
        onError(
          error instanceof Error ? error.message : "Unknown error occurred"
        );
      },
    });
  };

  return {
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
  };
};
