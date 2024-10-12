import "./App.css";
import "materialize-css/dist/css/materialize.min.css";
import "materialize-css/dist/js/materialize.min.js";
import Footer from "./components/Footer";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Account from "./pages/Account";

function App() {
  return (
    <>
      <Header />
      <main>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/account" element={<Account />} />
          </Routes>
        </BrowserRouter>
      </main>
      <Footer />
    </>
  );
}

export default App;
