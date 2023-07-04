import axios from "axios";
import { error } from "jquery";
import { useEffect, useState } from "react";
import { ChangePasswordForm } from "./types";
import { FormInstance } from "antd";
import { useMutation } from "react-query";
import { useForm } from "antd/es/form/Form";
import { LoginAuthResponse } from "../../Login/types";

export interface ChangePasswordStateProps {
  form: FormInstance<ChangePasswordForm>;
  doChangePassword: (
    data: ChangePasswordForm,
    onSuccess: () => void,
    onError: (error: string) => void
  ) => void;
}

export const useChangePassword: () => ChangePasswordStateProps = () => {
  const [form] = useForm<ChangePasswordForm>();

  const postChangePassword = (values: ChangePasswordForm) => {
    return axios.post(
      `http://localhost:8080/api/user/changePassword`,
      { username: sessionStorage.getItem("username"), ...values },
      {
        headers: {
          // Specify your desired headers here
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
  };

  const changePasswordMutation = useMutation(
    "changePasswordQuery",
    postChangePassword
  );

  const doChangePassword = (
    values: ChangePasswordForm,
    onSuccess: () => void,
    onError: (error: string) => void
  ) => {
    changePasswordMutation.mutate(values, {
      onSuccess: (res) => {
        sessionStorage.setItem(
          "token",
          (res.data as LoginAuthResponse).accessToken
        );
        onSuccess();
      },
      onError: (error) => {
        onError(
          error instanceof Error ? error.message : "Unknown error occurred"
        );
      },
    });
  };

  return {
    form,
    doChangePassword,
  };
};
