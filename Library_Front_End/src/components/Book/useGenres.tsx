import axios, { AxiosError, AxiosResponse } from "axios";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Dropdown, MenuProps, Pagination, Space, message } from "antd";
import { DownOutlined, UserOutlined } from "@ant-design/icons";
import { useQuery } from "react-query";

export interface GenresState {
  genres: string[];
  error?: any;
}

export const useGenres: () => GenresState = () => {
  const getGenres = () => {
    const currentURL = window.location.href;
    const ip = new URL(currentURL).hostname;
    return axios
      .get<any, AxiosResponse<string[]>>(
        `http://${ip}:8080/api/book/getGenres`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((r) => r.data);
  };

  const { error, data: genres = [] } = useQuery("getGenres", getGenres, {
    enabled: true,
    onError(err: AxiosError) {
      if (err.code == AxiosError.ERR_BAD_REQUEST) {
        window.location.href = "/login";
      }
    },
  });

  return {
    genres,
    error,
  };
};
