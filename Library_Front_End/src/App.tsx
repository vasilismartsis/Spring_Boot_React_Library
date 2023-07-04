import NavBar from "./components/NavBar/NavBar";
import Book from "./components/Book/Book";
import Reservation from "./components/Reservation/Reservation";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./components/Main/MainPage";
import BookList from "./components/Book/BookList";
import RegisterBook from "./components/RegisterBook/RegisterBook";
import Login from "./components/Login/Login";
import Profile from "./components/Profile/Profile";
import Security from "./components/Profile/Security/Security";
import MyReservations from "./components/Profile/MyReservations";
import { Layout } from "antd";
import { ReactQueryDevtools } from "react-query-devtools";
import { QueryClient, QueryClientProvider } from "react-query";
import User from "./components/User/User";

function App() {
  return (
    <>
      <QueryClientProvider client={new QueryClient()}>
        <NavBar />
        <BrowserRouter>
          <Routes>
            <Route
              index
              element={
                <>
                  <MainPage />
                </>
              }
            />
            <Route
              path="books"
              element={
                <>{sessionStorage.getItem("role") ? <Book /> : <Login />}</>
              }
            />
            <Route
              path="reservations"
              element={
                <>
                  {sessionStorage.getItem("role") == "ADMIN" ? (
                    <Reservation />
                  ) : (
                    <MainPage />
                  )}
                </>
              }
            />
            <Route
              path="users"
              element={
                <>
                  {sessionStorage.getItem("role") == "ADMIN" ? (
                    <User />
                  ) : (
                    <MainPage />
                  )}
                </>
              }
            />
            <Route
              path="register-book"
              element={
                <>
                  {sessionStorage.getItem("role") == "ADMIN" ? (
                    <RegisterBook />
                  ) : (
                    <MainPage />
                  )}
                </>
              }
            />
            <Route
              path="login"
              element={
                <>
                  <Login />
                </>
              }
            />
            <Route
              path="profile"
              element={
                <>
                  <Profile />
                </>
              }
            >
              <Route path="security" element={<Security />} />
              <Route path="my-reservations" element={<MyReservations />} />
            </Route>
            <Route path="*" element={<h1>Error 404 : Page Not Found</h1>} />
          </Routes>
        </BrowserRouter>
        {/* <ReactQueryDevtools initialIsOpen={false} position="bottom-right" /> */}
      </QueryClientProvider>
    </>
  );
}

export default App;
