import { BookFilter } from "../cmps/BookFilter.jsx";
import { BookList } from "../cmps/BookList.jsx";
import { bookService } from "../services/book.service.js";
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js";


const { useEffect, useState } = React;

export function BookIndex() {
  const [books, setBooks] = useState(null);
  const [filterBy, setFilterBy] = useState(bookService.getDefaultFilter());

  useEffect(() => {
    loadBooks();
  }, [filterBy]);

  function loadBooks() {
    bookService
      .query(filterBy)
      .then(setBooks)
      .catch((err) => {
        console.log("Problems getting books:", err);
        showErrorMsg("Sorry, we couldn't load books")
      });
  }

  function onRemoveBook(bookId) {
    bookService
      .remove(bookId)
      .then(() => {
        setBooks((books) => books.filter((book) => book.id !== bookId))
        console.log(bookId + "removed")
        showSuccessMsg("Book was removed successfully")
      })
      .catch((err) => {
        console.log("Problems removing book:", err)
        showErrorMsg("Error removing book")
      });
  }

  function onSetFilter(filterBy) {
    setFilterBy((prevFilter) => ({ ...prevFilter, ...filterBy }));
  }

  if (!books) return <div>Loading...</div>;
  return (
    <section className="book-index">
      <section>
        <BookFilter defaultFilter={filterBy} onSetFilter={onSetFilter} />
      </section>
      <BookList books={books} onRemoveBook={onRemoveBook} />
    </section>
  );
}
