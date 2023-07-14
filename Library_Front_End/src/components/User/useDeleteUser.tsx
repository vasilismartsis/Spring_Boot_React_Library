import { message } from "antd";
import { FormInstance, useForm } from "antd/es/form/Form";
import { useState } from "react";
import { useUsers } from "./useUsers";
import { LibraryUser } from "./types";

export interface useDeleteUserState {
  handleDeleteUserOk: () => void;
  setDeletedUser: React.Dispatch<React.SetStateAction<LibraryUser>>;
}

export const useDeleteUser: () => useDeleteUserState = () => {
  const [deletedUser, setDeletedUser] = useState<LibraryUser>(
    {} as LibraryUser
  );

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
    doDeleteUser,
    setSelectedRoles,
  } = useUsers();

  const handleDeleteUserOk = () => {
    doDeleteUser(deletedUser, onDeleteUserSuccess, onDeleteUserError);
  };

  const onDeleteUserSuccess = () => {
    userRefetch();
    message.info(
      <span style={{ fontSize: "30px" }}>User deleteed successfully</span>
    );
  };

  const onDeleteUserError = (error: any) => {
    {
      message.info(
        <span style={{ fontSize: "30px" }}>Internal Error: {error}</span>
      );
    }
  };
  return {
    handleDeleteUserOk,
    setDeletedUser,
  };
};
