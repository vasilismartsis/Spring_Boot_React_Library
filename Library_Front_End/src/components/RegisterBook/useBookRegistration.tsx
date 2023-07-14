import axios from "axios";
import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Button, Dropdown, MenuProps, Pagination, Space, message } from "antd";
import { DownOutlined, UserOutlined } from "@ant-design/icons";
import { RegisterBookForm } from "./types";
import { FormInstance, useForm } from "antd/es/form/Form";
import { useMutation } from "react-query";
import { LoginAuthResponse } from "../Login/types";

export interface RegistrationState {
  form: FormInstance<RegisterBookForm>;
  doBookRegistration: (
    data: RegisterBookForm,
    onSuccess: () => void,
    onError: (error: string) => void
  ) => void;
}

export const useBookRegistration: () => RegistrationState = () => {
  const [form] = useForm<RegisterBookForm>();

  const postBookRegistration = (values: RegisterBookForm) => {
    const currentURL = window.location.href;
    const ip = new URL(currentURL).hostname;
    return axios.post(`http://${ip}:8080/api/book/registerBook`, values, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
  };

  const bookRegistrationMutation = useMutation(
    "bookRegistrationQuery",
    postBookRegistration
  );

  const doBookRegistration = (
    values: RegisterBookForm,
    onSuccess: () => void,
    onError: (error: string) => void
  ) => {
    bookRegistrationMutation.mutate(values, {
      onSuccess,
      onError: (error) => {
        onError(
          error instanceof Error ? error.message : "Unknown error occurred"
        );
      },
    });
  };

  return {
    form,
    doBookRegistration,
  };
};
