import "./App.css";
import "materialize-css/dist/css/materialize.min.css";
import "materialize-css/dist/js/materialize.min.js";
import Footer from "./components/Footer";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Account from "./pages/Account";
import SearchResults from "./components/SearchResults";
import CartPage from "./pages/CartPage";
import BookCreation from "./pages/BookCreation";
import BookUpdate from "./pages/BookUpdate";
import Login from "./pages/Login";
import { AuthProvider } from "./components/Utils/AuthContext";
import Signup from "./pages/Signup";
import PrivateWrapper from "./components/Utils/PrivateWrapper";
import Unauthorized from "./pages/Unauthorized";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/account" element={<Account />} />
            <Route path="/search-results" element={<SearchResults />} />
            <Route path="/cart" element={<CartPage />} />
            <Route
              path="/book-creation"
              element={
                <PrivateWrapper requiredRole={"admin"}>
                  <BookCreation />
                </PrivateWrapper>
              }
            />
            <Route
              path="/book-update/:id"
              element={
                <PrivateWrapper requiredRole={"admin"}>
                  <BookUpdate />
                </PrivateWrapper>
              }
            />
            <Route
              path="/login"
              element={
                <PrivateWrapper>
                  <Login />
                </PrivateWrapper>
              }
            />
            <Route
              path="/signup"
              element={
                <PrivateWrapper>
                  <Signup />
                </PrivateWrapper>
              }
            />
            <Route path="/signup" element={<Signup />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/*" element={<HomePage />} />
          </Routes>
        </main>
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
