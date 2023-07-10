export type UserResource = {
  totalLibraryUserNumber: number;
  singleLibraryUserResponse: LibraryUser[];
};

export type LibraryUser = {
  id: number;
  username: string;
  password: string;
  roles: string[];
  createdBy: string;
  lastModifiedBy: string;
  creationDate: Date;
  lastModifiedDate: Date;
};
