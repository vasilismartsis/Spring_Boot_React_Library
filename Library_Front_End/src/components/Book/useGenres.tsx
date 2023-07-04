import axios from "axios";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Dropdown, MenuProps, Pagination, Space, message } from "antd";
import { DownOutlined, UserOutlined } from "@ant-design/icons";
import { useQuery } from "react-query";

export interface GenresState {
  genres: string[];
  error?: any;
}

export const useGenres: () => GenresState = () => {
  const [genres, setGenres] = useState<string[]>([]);

  const getGenres = () => {
    return axios.get(`http://localhost:8080/api/book/getGenres`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
  };

  const { error } = useQuery("getGenres", getGenres, {
    onSuccess: (res) => {
      setGenres(res.data);
    },
  });

  return {
    genres,
    error,
  };
};
