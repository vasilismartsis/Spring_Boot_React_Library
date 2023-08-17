import { SorterResult } from "antd/es/table/interface";
import { createContext } from "react";
import { LibraryUser } from "./types";

interface UserContextValue {
  totalUsers: number;
  users: LibraryUser[];
  userError?: any;
  roles: string[];
  roleError?: any;
  roleRefetch: () => void;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  currentPage: number;
  userRefetch: () => void;
  setSorterResult: React.Dispatch<
    React.SetStateAction<SorterResult<LibraryUser>>
  >;
  setSearchColumn: React.Dispatch<React.SetStateAction<string>>;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  doEditUser: (
    data: LibraryUser,
    onSuccess: () => void,
    onError: (error: string) => void
  ) => void;
  doAddUser: (
    data: LibraryUser,
    onSuccess: () => void,
    onError: (error: string) => void
  ) => void;
  doDeleteUser: (
    data: LibraryUser,
    onSuccess: () => void,
    onError: (error: string) => void
  ) => void;
  setSelectedRoles: React.Dispatch<React.SetStateAction<string[]>>;
}

export const UserContext = createContext<UserContextValue>({
  totalUsers: 0,
  users: [],
  userError: "",
  roles: [],
  roleError: "",
  roleRefetch: () => {},
  setCurrentPage: () => {},
  currentPage: 1,
  userRefetch: () => {},
  setSorterResult: () => {},
  setSearchColumn: () => {},
  setSearchValue: () => {},
  doEditUser: () => {},
  doAddUser: () => {},
  doDeleteUser: () => {},
  setSelectedRoles: () => {},
});
