import { AppHeader } from "./cmps/AppHeader.jsx";
import { HomePage } from "./cmps/HomePage.jsx";
import { AboutUs } from "./cmps/AboutUs.jsx";
import { BookIndex } from "./cmps/BookIndex.jsx";
import { BookDetails } from "./cmps/BookDetails.jsx";
import { BookEdit } from "./cmps/BookEdit.jsx";

const Router = ReactRouterDOM.HashRouter;
const { Routes, Route, Navigate } = ReactRouterDOM;

export function RootCmp() {
  return (
    <Router>
      <section className="app">
        <AppHeader />
        <main className="main-layout">
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<HomePage />} />
             <Route path="/about" element={<AboutUs />} />
            <Route path="/book" element={<BookIndex />} />
           <Route path="/book/:bookId" element={<BookDetails />} />
           <Route path="/book/edit" element={<BookEdit />} /> 
          </Routes>
        </main>
      </section>
    </Router>
  );
}


