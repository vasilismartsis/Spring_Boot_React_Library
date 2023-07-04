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
    return axios.post(`http://localhost:8080/api/book/registerBook`, values, {
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

  // const postBookRegistration = axios.create({
  //   baseURL: `http://localhost:8080/api/book/registerBook`,
  //   headers: {
  //     Authorization: `Bearer ${sessionStorage.getItem("token")}`,
  //   },
  // });

  // useEffect(() => {
  //   if (bookTitle != "" || bookGenre != "") {
  //     setIsLoading(true);
  //     setError(undefined);
  //     postBookRegistration
  //       .post("", { bookTitle, bookGenre })
  //       .then((res) => {
  //         setBookRegistrationResCode(res.status);
  //         setIsLoading(false);
  //         setError(undefined);
  //       })
  //       .catch((error) => {
  //         setBookRegistrationResCode(error["code"]);
  //         setError(error);
  //         setIsLoading(false);
  //       });
  //   }
  // }, [registerBookButtonClick]);

  return {
    form,
    doBookRegistration,
  };
};
