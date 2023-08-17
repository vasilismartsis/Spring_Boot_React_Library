import { message } from "antd";
import { FormInstance, useForm } from "antd/es/form/Form";
import { useContext, useState } from "react";
import { AddUserForm } from "./types";
import { useUsers } from "./useUsers";
import { UserContext } from "./UserContext";

export interface useAddUserState {
  openAddUserModal: boolean;
  addUserForm: FormInstance<AddUserForm>;
  handleAddUser: () => void;
  handleAddUserOk: () => void;
  handleAddUserCancel: () => void;
  onAddUserFinish: (values: any) => void;
  onAddUserFinishFailed: (errorInfo: any) => void;
}

export const useAddUser: () => useAddUserState = () => {
  const [openAddUserModal, setOpenAddUserModal] = useState(false);
  const [addUserForm] = useForm<AddUserForm>();

  const {
    totalUsers,
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
    doEditUser,
    doAddUser,
    doDeleteUser,
    setSelectedRoles,
  } = useContext(UserContext);

  const handleAddUser = () => {
    setOpenAddUserModal(true);
  };

  const handleAddUserOk = () => {
    addUserForm.submit();
  };

  const handleAddUserCancel = () => {
    setOpenAddUserModal(false);
  };

  const onAddUserFinish = (values: any) => {
    const mappedValues = {
      ...values,
      createdBy: sessionStorage.getItem("username") ?? "",
      lastModifiedBy: sessionStorage.getItem("username") ?? "",
    };

    doAddUser(mappedValues, onAddUserSuccess, onAddUserError);
  };

  const onAddUserFinishFailed = (errorInfo: any) => {
    message.info(
      <span style={{ fontSize: "30px" }}>Please complete all fields</span>
    );
  };

  const onAddUserSuccess = () => {
    userRefetch();
    setOpenAddUserModal(false);
    addUserForm.resetFields();
    message.info(
      <span style={{ fontSize: "30px" }}>User added successfully</span>
    );
  };

  const onAddUserError = (error: any) => {
    {
      message.info(
        <span style={{ fontSize: "30px" }}>Internal Error: {error}</span>
      );
    }
  };
  return {
    openAddUserModal,
    addUserForm,
    handleAddUser,
    handleAddUserOk,
    handleAddUserCancel,
    onAddUserFinish,
    onAddUserFinishFailed,
  };
};
