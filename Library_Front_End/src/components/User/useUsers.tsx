import axios, { AxiosError, AxiosResponse } from "axios";
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
  totalUsers: number;
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
  doEditUser: (
    data: LibraryUser,
    onSuccess: () => void,
    onError: (error: string) => void
  ) => void;
  doAddUser: (
    data: LibraryUser,
    onSuccess: () => void,
    onError: (error: string) => void
  ) => void;
  doDeleteUser: (
    data: LibraryUser,
    onSuccess: () => void,
    onError: (error: string) => void
  ) => void;
  setSelectedRoles: React.Dispatch<React.SetStateAction<string[]>>;
}

export const useUsers: () => UsersState = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sorterResult, setSorterResult] = useState<SorterResult<LibraryUser>>(
    {}
  );
  const [searchColumn, setSearchColumn] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  //Get roles
  const getRoles = () => {
    const currentURL = window.location.href;
    const ip = new URL(currentURL).hostname;
    return axios
      .get<any, AxiosResponse<string[]>>(
        `http://${ip}:8080/api/user/getRoles`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((r) => r.data);
  };

  const {
    error: roleError,
    data: roleData,
    refetch: roleRefetch,
  } = useQuery("getRoles", getRoles, {
    enabled: true,
  });

  //Get users
  const getUsers = () => {
    const currentURL = window.location.href;
    const ip = new URL(currentURL).hostname;
    return axios
      .get<any, AxiosResponse<UserResource>>(
        `http://${ip}:8080/api/user/getUsers?selectedRoles=${selectedRoles}&page=${currentPage}&order=${sorterResult.order}&sortedColumn=${sorterResult.field}&searchColumn=${searchColumn}&searchValue=${searchValue}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((r) => r.data);
  };

  const {
    error: userError,
    data: userData,
    refetch: userRefetch,
  } = useQuery("getUsers", getUsers, {
    enabled: false,
    onError(err: AxiosError) {
      if (err.code == AxiosError.ERR_BAD_REQUEST) {
        window.location.href = "/login";
      }
    },
  });

  useEffect(() => {
    userRefetch();
  }, [currentPage, sorterResult, searchValue, searchColumn, selectedRoles]);

  //Add user
  const postAddUser = (values: LibraryUser) => {
    const currentURL = window.location.href;
    const ip = new URL(currentURL).hostname;
    return axios.post(`http://${ip}:8080/api/user/addUser`, values, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
  };

  const addUserMutation = useMutation("addUserQuery", postAddUser);

  const doAddUser = (
    values: LibraryUser,
    onSuccess: () => void,
    onError: (error: string) => void
  ) => {
    addUserMutation.mutate(values, {
      onSuccess,
      onError: (error) => {
        onError(
          error instanceof Error ? error.message : "Unknown error occurred"
        );
      },
    });
  };

  //Edit user
  const postEditUser = (values: LibraryUser) => {
    const currentURL = window.location.href;
    const ip = new URL(currentURL).hostname;
    return axios.post(`http://${ip}:8080/api/user/editUser`, values, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
  };

  const editUserMutation = useMutation("editUserQuery", postEditUser);

  const doEditUser = (
    values: LibraryUser,
    onSuccess: () => void,
    onError: (error: string) => void
  ) => {
    editUserMutation.mutate(values, {
      onSuccess,
      onError: (error) => {
        onError(
          error instanceof Error ? error.message : "Unknown error occurred"
        );
      },
    });
  };

  //Delete user
  const postDeleteUser = (values: LibraryUser) => {
    const currentURL = window.location.href;
    const ip = new URL(currentURL).hostname;
    return axios.post(`http://${ip}:8080/api/user/deleteUser`, values, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
  };

  const deleteUserMutation = useMutation("deleteUserQuery", postDeleteUser);

  const doDeleteUser = (
    values: LibraryUser,
    onSuccess: () => void,
    onError: (error: string) => void
  ) => {
    deleteUserMutation.mutate(values, {
      onSuccess,
      onError: (error) => {
        onError(
          error instanceof Error ? error.message : "Unknown error occurred"
        );
      },
    });
  };

  return {
    totalUsers: userData?.totalLibraryUsers || 0,
    users: userData?.singleLibraryUserResponse || [],
    userError,
    roles: roleData || [],
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
  };
};
