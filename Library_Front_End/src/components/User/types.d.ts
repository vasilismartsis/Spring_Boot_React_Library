import { ColumnType } from "antd/es/table";

export type UserResource = {
  totalLibraryUsers: number;
  singleLibraryUserResponse: LibraryUser[];
};

export type LibraryUser = {
  id: number;
  username: string;
  password: string;
  roles: string[];
  createdBy: string;
  lastModifiedBy: string;
  creationDate: string;
  lastModifiedDate: string;
};

export interface UserColumn extends ColumnType<LibraryUser> {
  searchable?: boolean;
  sortable?: boolean;
}

export type AddUserForm = {
  username: string;
  password: string;
  roles: string[];
}

export type EditUserForm = {
  username: string;
  password: string;
  roles: string[];
}