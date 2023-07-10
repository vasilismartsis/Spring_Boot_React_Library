import BookList from "./BookList";
import "./Book.css";

export interface BookProps {}

const Book: React.FC<BookProps> = (props) => {
  return (
    <>
      <h1 className="table-label">Books</h1>
      <BookList />
    </>
  );
};

export default Book;
