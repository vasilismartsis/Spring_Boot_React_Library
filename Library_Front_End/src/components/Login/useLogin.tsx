import axios, { AxiosError, AxiosResponse } from "axios";
import { error } from "jquery";
import { useCallback, useEffect, useState } from "react";
import { LoginAuthResponse, LoginForm } from "./types";
import { FormInstance, useForm } from "antd/es/form/Form";
import { useQuery, useMutation } from "react-query";

export interface LoginStateProps {
  form: FormInstance<LoginForm>;
  doLogin: (
    data: LoginForm,
    onSuccess: () => void,
    onError: (error: string) => void
  ) => void;
}

export const useLogin: () => LoginStateProps = () => {
  const [form] = useForm<LoginForm>();

  const postLogin = (values: LoginForm) => {
    const currentURL = window.location.href;
    const ip = new URL(currentURL).hostname;
    return axios
      .post<any, AxiosResponse<LoginAuthResponse>>(
        `http://${ip}:8080/api/login`,
        values
      )
      .then((r) => r.data);
  };

  const { mutate } = useMutation("loginQuery", postLogin);

  const doLogin = (
    values: LoginForm,
    onSuccess: () => void,
    onError: (error: string) => void
  ) => {
    mutate(values, {
      onSuccess: (res) => {
        const base64Url = res.accessToken.split(".")[1];
        const base64 = base64Url.replace("-", "+").replace("_", "/");
        const tokenBase64Object = JSON.parse(window.atob(base64));
        const tokenUserName = tokenBase64Object["sub"];
        sessionStorage.setItem("username", tokenUserName);
        sessionStorage.setItem("token", res.accessToken);
        sessionStorage.setItem("role", res.role);
        onSuccess();
      },
      onError: (error) => {
        if (error instanceof AxiosError) {
          onError(error.response?.data);
        }
      },
    });
  };

  return {
    form,
    doLogin,
  };
};
