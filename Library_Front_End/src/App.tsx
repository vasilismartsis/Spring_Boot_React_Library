import NavBar from "./components/NavBar/NavBar";
import Book from "./components/Book/Book";
import Reservation from "./components/Reservation/Reservation";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./components/Main/MainPage";
import BookList from "./components/Book/BookList";
import Login from "./components/Login/Login";
import Profile from "./components/Profile/Profile";
import Security from "./components/Profile/Security/Security";
import MyReservations from "./components/Profile/MyReservations/MyReservations";
import { Layout } from "antd";
import { ReactQueryDevtools } from "react-query-devtools";
import { QueryClient, QueryClientProvider } from "react-query";
import User from "./components/User/User";
import WebSocketTest from "./components/WebSocket/WebSocketTest";

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
            <Route path="webSocketTest" element={<WebSocketTest />} />
            <Route
              path="books"
              element={
                <>{sessionStorage.getItem("role") ? <Book /> : <Book />}</>
              }
            />
            <Route
              path="reservations"
              element={
                <>
                  {sessionStorage.getItem("role") == "ADMIN" ? (
                    <Reservation />
                  ) : (
                    <Login />
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
                    <Login />
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
              <Route
                path="security"
                element={
                  <>
                    {sessionStorage.getItem("role") == "ADMIN" ? (
                      <Security />
                    ) : (
                      <Login />
                    )}
                  </>
                }
              />
              <Route
                path="my-reservations"
                element={
                  <>
                    {sessionStorage.getItem("role") == "ADMIN" ? (
                      <MyReservations />
                    ) : (
                      <Login />
                    )}
                  </>
                }
              />
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
