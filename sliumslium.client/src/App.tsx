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

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/account" element={<Account />} />
          <Route path="/search-results" element={<SearchResults />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/book-creation" element={<BookCreation />} />
          <Route path="/*" element={<HomePage />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
