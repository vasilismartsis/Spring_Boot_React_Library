import { message } from "antd";
import { FormInstance, useForm } from "antd/es/form/Form";
import { useContext, useState } from "react";
import { useUsers } from "./useUsers";
import { LibraryUser } from "./types";
import { UserContext } from "./UserContext";

export interface useDeleteUserState {
  handleDeleteUserOk: () => void;
  setDeletedUser: React.Dispatch<React.SetStateAction<LibraryUser>>;
}

export const useDeleteUser: () => useDeleteUserState = () => {
  const [deletedUser, setDeletedUser] = useState<LibraryUser>(
    {} as LibraryUser
  );

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

  const handleDeleteUserOk = () => {
    doDeleteUser(deletedUser, onDeleteUserSuccess, onDeleteUserError);
  };

  const onDeleteUserSuccess = () => {
    userRefetch();
    message.info(
      <span style={{ fontSize: "30px" }}>User deleted successfully</span>
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
