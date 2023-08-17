import React from "react";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  cleanup,
  act,
  renderHook,
} from "@testing-library/react";
import App from "./App";
import BookList from "./components/Book/BookList";
import Book from "./components/Book/Book";
import { QueryClient, QueryClientProvider } from "react-query";
import "../matchMedia";
import { BookContext } from "./components/Book/BookContext";
import Test from "./components/Test";
import * as useReserveBookModule from "./components/Book/useReserveBook";
import * as useGenresModule from "./components/Book/useGenres";
import { ReservationContext } from "./components/Reservation/ReservationContext";
import ReservationList from "./components/Reservation/ReservationList";
import { useDeleteReservation } from "./components/Reservation/useDeleteReservation";
import UserList from "./components/User/UserList";
import { UserContext } from "./components/User/UserContext";

/* // Run cleanup after each test
afterAll(() => {
  cleanup();
}); */

jest.mock("@ant-design/plots", () => ({
  Pie: jest.fn(),
  PieConfig: jest.fn(),
}));

window.matchMedia = (query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(), // deprecated
  removeListener: jest.fn(), // deprecated
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
});

// Mocking useGenres module
jest.mock("./components/Book/useGenres", () => ({
  useGenres: () => ({
    genres: ["Genre1", "Genre2"],
    error: null,
  }),
}));

const mockDoReserveBook = jest.fn();
jest.mock("./components/Book/useReserveBook", () => ({
  useReserveBook: () => ({
    doReserveBook: mockDoReserveBook,
  }),
}));

jest.mock("jspdf", () => ({
  create: jest.fn(() => {
    return Promise.resolve();
  }),
}));

/* // The other way to mock using Spy

  const mockDoReserveBook = jest.fn();

  // Spy on the useReserveBook function and replace its return value with the mock
  jest.spyOn(useReserveBookModule, "useReserveBook").mockReturnValue({
    doReserveBook: mockDoReserveBook,
  });

  const mockGenres = ["Genre1", "Genre2"]; // Mocked genres array
  const mockUseGenres = jest.spyOn(useGenresModule, "useGenres"); // Spy on the useGenres function
  mockUseGenres.mockReturnValue({ genres: mockGenres, error: null }); // Mock the return value
 */

/* // A test component test
  import TestComponent from "./components/Book/TestComponent";
  import { useTestComponent } from "./components/Book/useTestComponent";
  import * as useTestComponentModule from "./components/Book/useTestComponent";

  describe("TestComponent", () => {
    it("calls doSomething when the button is clicked", () => {
      // Create a mock implementation of doSomething
      const mockDoSomething = jest.fn();

      // Spy on the useTestComponent function and replace its return value with the mock
      jest.spyOn(useTestComponentModule, "useTestComponent").mockReturnValue({
        doSomething: mockDoSomething,
      });

      // Render the TestComponent
      const { getByText } = render(<TestComponent />);

      // Simulate a button click
      fireEvent.click(getByText("Test Button"));

      // Verify if doSomething was called
      expect(mockDoSomething).toHaveBeenCalled();
    });
  }); */

describe("BookList", () => {
  const mockBook = {
    id: 1,
    title: "Test Book",
    genre: "Fiction",
    quantity: 5,
    createdBy: "test",
    lastModifiedBy: "test",
    creationDate: new Date(),
    lastModifiedDate: new Date(),
  };

  const mockBookContext = {
    totalBooks: 0,
    totalZeroQuantityBooks: 0,
    totalBookCopies: 0,
    totalBookCopiesReserved: 0,
    books: [mockBook],
    bookError: "",
    setCurrentPage: () => {},
    currentPage: 1,
    pageSize: 5,
    setPageSize: () => {},
    setGenres: () => {},
    bookRefetch: () => {},
    setSorterResult: () => {},
    setSearchColumn: () => {},
    setSearchValue: () => {},
    doAddBook: () => {},
    doEditBook: () => {},
    doDeleteBook: () => {},
    xlsxError: {},
    xlsxRefetch: () => {},
    pdfError: {},
    pdfRefetch: () => {},
    pptxError: {},
    pptxRefetch: () => {},
  };

  beforeEach(() => {
    sessionStorage.setItem("role", "ADMIN");
    render(
      <BookContext.Provider value={mockBookContext}>
        <BookList />
      </BookContext.Provider>
    );
  });

  it("renders add a new book button", () => {
    const linkElement = screen.getByText(/Add a new book/i);
    expect(linkElement).toBeInTheDocument();
  });

  it("renders reserve button", () => {
    const linkElement = screen.getByText(/reserve/i);
    expect(linkElement).toBeInTheDocument();
  });

  it("calls doReserveBook when the Reserve button is clicked", () => {
    // Render the BookList component with the mock context

    // Find and click the Reserve button
    fireEvent.click(screen.getByText("Reserve"));

    // Verify if doReserveBook was called
    expect(mockDoReserveBook).toHaveBeenCalled();
  });

  it("renders Add Book Modal", async () => {
    const addButton = screen.getByText("Add a new book");
    fireEvent.click(addButton);

    await waitFor(() => {
      const modalTitle = screen.getByText("Add Book");
      expect(modalTitle).toBeInTheDocument();
    });
  });

  it("renders table columns", () => {
    const idColumn = screen.getByText("Id");
    const titleColumn = screen.getByText("Title");
    const genreColumn = screen.getByText("Genre");
    const quantityColumn = screen.getByText("Quantity");
    const actionColumn = screen.getByText("Action");

    expect(idColumn).toBeInTheDocument();
    expect(titleColumn).toBeInTheDocument();
    expect(genreColumn).toBeInTheDocument();
    expect(quantityColumn).toBeInTheDocument();
    expect(actionColumn).toBeInTheDocument();
  });

  it("toggles pie chart on button click", () => {
    const pieChartButton = screen.getByText("Pie Chart");
    fireEvent.click(pieChartButton);

    const showCopiesButton = screen.getByText("Show Total");
    expect(showCopiesButton).toBeInTheDocument();

    fireEvent.click(showCopiesButton);

    const showTotalButton = screen.getByText("Show Available");
    expect(showTotalButton).toBeInTheDocument();
  });

  it("opens Edit Book modal after button click", async () => {
    const editButton = screen.getByText("Edit");
    fireEvent.click(editButton);

    const modalTitle = await screen.findByText("Edit Book");
    expect(modalTitle).toBeInTheDocument();
  });
});

const mockDoDeleteReservation = jest.fn();
jest.mock("./components/Reservation/useReservations", () => ({
  useReservations: () => ({
    doDeleteReservation: mockDoDeleteReservation,
  }),
}));

describe("ReservationList", () => {
  const mockReservation = {
    id: 1,
    username: "Test user",
    bookTitle: "Test Book",
    reservationDate: new Date(),
    expirationDate: new Date(),
    createdBy: "test",
    lastModifiedBy: "test",
    creationDate: new Date(),
    lastModifiedDate: new Date(),
  };

  const mockReservationContext = {
    totalReservations: 1,
    reservations: [mockReservation],
    reservationError: "",
    setCurrentPage: jest.fn(),
    currentPage: 1,
    reservationRefetch: jest.fn(),
    setSorterResult: jest.fn(),
    setSearchColumn: jest.fn(),
    setSearchValue: jest.fn(),
    doEditReservation: jest.fn(),
    doDeleteReservation: mockDoDeleteReservation,
  };

  beforeEach(() => {
    sessionStorage.setItem("role", "ADMIN");
    render(
      <ReservationContext.Provider value={mockReservationContext}>
        <ReservationList />
      </ReservationContext.Provider>
    );
  });

  it("renders table columns", () => {
    const idColumn = screen.getByText("Id");
    const userColumn = screen.getByText("User");
    const bookTitleColumn = screen.getByText("Book Title");
    // ... other column texts ...

    expect(idColumn).toBeInTheDocument();
    expect(userColumn).toBeInTheDocument();
    expect(bookTitleColumn).toBeInTheDocument();
    // ... assert other columns ...
  });

  it("opens Edit Reservation modal after button click", async () => {
    const editButton = screen.getByText("Edit");
    fireEvent.click(editButton);

    await waitFor(() => {
      const modalTitle = screen.getByText("Edit Reservation");
      expect(modalTitle).toBeInTheDocument();
    });
  });

  it("deletes a reservation after confirmation", async () => {
    const deleteButton = screen.getByText("Delete");
    fireEvent.click(deleteButton);

    const confirmButton = await screen.findByText("Yes");
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockDoDeleteReservation).toHaveBeenCalled();
    });
  });

  it("updates sorter result on column header click", () => {
    const titleColumnHeader = screen.getByText(/Book Title/);

    fireEvent.click(titleColumnHeader);

    expect(mockReservationContext.setSorterResult).toHaveBeenCalled();
  });

  it("cancels reservation deletion when 'No' is clicked in confirmation", async () => {
    const deleteButton = screen.getByText("Delete");
    fireEvent.click(deleteButton);

    const cancelButton = await screen.findByText("No");
    fireEvent.click(cancelButton);

    expect(mockDoDeleteReservation).not.toHaveBeenCalled();
  });
});

const mockDoEditUser = jest.fn();
jest.mock("./components/User/useUsers", () => ({
  useUsers: () => ({
    doEditUser: mockDoEditUser,
  }),
}));

const mockDoDeleteUser = jest.fn();
jest.mock("./components/User/useUsers", () => ({
  useUsers: () => ({
    doDeleteUser: mockDoDeleteUser,
  }),
}));

describe("UserList", () => {
  const mockUser = {
    id: 1,
    username: "test",
    password: "test",
    roles: ["ADMIN"],
    createdBy: "test",
    lastModifiedBy: "test",
    creationDate: new Date(),
    lastModifiedDate: new Date(),
  };

  const mockUserContext = {
    totalUsers: 0,
    users: [mockUser],
    userError: "",
    roles: ["ADMIN", "CUSTOMER"],
    roleError: "",
    roleRefetch: () => {},
    setCurrentPage: () => {},
    currentPage: 1,
    userRefetch: () => {},
    setSorterResult: () => {},
    setSearchColumn: () => {},
    setSearchValue: () => {},
    doEditUser: mockDoEditUser,
    doAddUser: () => {},
    doDeleteUser: mockDoDeleteUser,
    setSelectedRoles: () => {},
  };

  beforeEach(() => {
    sessionStorage.setItem("role", "ADMIN");
    render(
      <UserContext.Provider value={mockUserContext}>
        <UserList />
      </UserContext.Provider>
    );
  });

  it("renders Add User Modal", async () => {
    const addButton = screen.getByText(/Add a new User/i);
    fireEvent.click(addButton);

    await waitFor(() => {
      const modalTitle = screen.getByText("Add User");
      expect(modalTitle).toBeInTheDocument();
    });
  });

  it("edits a user", async () => {
    fireEvent.click(screen.getByText("Edit"));

    const passwordInput = screen.getByPlaceholderText("Input password");

    fireEvent.change(passwordInput, {
      target: { value: "password" },
    });

    fireEvent.click(screen.getByText("OK"));

    await waitFor(() => {
      expect(mockDoEditUser).toHaveBeenCalled();
    });
  });

  it("edits a user fails if not all fields are complete", async () => {
    await act(async () => {
      fireEvent.click(screen.getByText("Edit"));
    });
    await act(async () => {
      fireEvent.click(screen.getByText("OK"));
    });

    await waitFor(() => {
      expect(mockDoEditUser).not.toHaveBeenCalled();
    });
  });

  it("deletes a user", () => {
    fireEvent.click(screen.getByText("Delete"));

    fireEvent.click(screen.getByText("Yes"));

    expect(mockDoDeleteUser).toHaveBeenCalled();
  });
});
