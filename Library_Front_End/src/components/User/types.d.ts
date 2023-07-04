export type UserResource = {
    totalLibraryUserNumber: number;
    singleLibraryUserResponse: LibraryUser[];
}

export type LibraryUser = {
        id: number;
        username: string;
        createdBy: string;
        lastModifiedBy: string;
        creationDate: Date;
        lastModifiedDate: Date;
}