import { FormInstance, message } from "antd";
import { EditUserForm, LibraryUser } from "./types";
import { useUsers } from "./useUsers";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "antd/es/form/Form";

export interface useEditUserState {
  openEditUserModal: boolean;
  editUserForm: FormInstance<EditUserForm>;
  handleEditUser: () => void;
  handleEditUserOk: () => void;
  handleEditUserCancel: () => void;
  onEditUserFinish: (values: any) => void;
  onEditUserFinishFailed: (errorInfo: any) => void;
  setOpenEditUserModal: React.Dispatch<React.SetStateAction<boolean>>;
  editedUser: LibraryUser;
  setEditedUser: React.Dispatch<React.SetStateAction<LibraryUser>>;
}

export const useEditUser: () => useEditUserState = () => {
  const [openEditUserModal, setOpenEditUserModal] = useState(false);
  const [editUserForm] = useForm<EditUserForm>();
  const [editedUser, setEditedUser] = useState<LibraryUser>({} as LibraryUser);

  const {
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
    doAddUser,
    setSelectedRoles,
  } = useUsers();

  useEffect(() => {
    if (Object.keys(editedUser).length > 0) {
      editUserForm.setFieldsValue({
        username: editedUser.username,
        roles: editedUser.roles,
      });
    }
  }, [editUserForm, editedUser, openEditUserModal]);

  const handleEditUser = () => {
    setOpenEditUserModal(true);
  };

  const handleEditUserOk = () => {
    editUserForm.submit();
  };

  const handleEditUserCancel = () => {
    setOpenEditUserModal(false);
    editUserForm.resetFields();
  };

  const onEditUserFinish = (values: any) => {
    const mappedValues = {
      ...values,
      id: editedUser.id,
      lastModifiedBy: sessionStorage.getItem("username") ?? "",
    };

    doUpdateUser(mappedValues, onEditUserSuccess, onEditUserError);
  };

  const onEditUserFinishFailed = (errorInfo: any) => {
    message.info(
      <span style={{ fontSize: "30px" }}>Please complete all fields!</span>
    );
  };

  const onEditUserSuccess = () => {
    userRefetch();
    setOpenEditUserModal(false);
    editUserForm.resetFields();
    message.info(
      <span style={{ fontSize: "30px" }}>User updated successfully!</span>
    );
  };

  const onEditUserError = (error: any) => {
    {
      message.info(
        <span style={{ fontSize: "30px" }}>Internal Error: {error}</span>
      );
    }
  };
  return {
    openEditUserModal,
    editUserForm,
    handleEditUser,
    handleEditUserOk,
    handleEditUserCancel,
    onEditUserFinish,
    onEditUserFinishFailed,
    setOpenEditUserModal,
    editedUser,
    setEditedUser,
  };
};
