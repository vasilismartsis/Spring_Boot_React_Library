export type BookResource = {
    totalBookNumber: number;
    singleBookResponse: Book[];
}

export type Book = {
        id: number;
        title: string;
        genre: string;
        createdBy: string;
        lastModifiedBy: string;
        creationDate: Date;
        lastModifiedDate: Date;
}