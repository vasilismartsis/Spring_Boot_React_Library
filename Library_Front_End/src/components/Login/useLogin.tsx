import axios from "axios";
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
    return axios.post(`http://${ip}:8080/api/login`, values);
  };

  const loginMutation = useMutation("loginQuery", postLogin);

  const doLogin = (
    values: LoginForm,
    onSuccess: () => void,
    onError: (error: string) => void
  ) => {
    loginMutation.mutate(values, {
      onSuccess: (res) => {
        const base64Url = (res.data as LoginAuthResponse).accessToken.split(
          "."
        )[1];
        const base64 = base64Url.replace("-", "+").replace("_", "/");
        const tokenBase64Object = JSON.parse(window.atob(base64));
        const tokenUserName = tokenBase64Object["sub"];
        sessionStorage.setItem("username", tokenUserName);
        sessionStorage.setItem(
          "token",
          (res.data as LoginAuthResponse).accessToken
        );
        sessionStorage.setItem("role", (res.data as LoginAuthResponse).role);
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
    doLogin,
  };
};
