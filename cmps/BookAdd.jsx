import { utilService } from "../react-books-proj/services/util.service.js";
import { bookService } from "../react-books-proj/services/book.service.js";
import { showErrorMsg } from "../services/event-bus.service.js";
const { useState } = React;

export function BookAdd() {
  const [books, setBooks] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  const debouncedSearch = utilService.debounce(searchBooks, 500);

  const searchBooks = async (input) => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${input}`
      );
      const data = await response.json();

      const results = data.items.map((item) => ({
        id: item.id,
        title: item.volumeInfo.title,
      }));

      setBooks(results);
    } catch (error) {
      console.error("Error fetching data:", error);
      showErrorMsg("Failed to fetch books. Please try again.");
    }
  };

  const handleInputChange = (ev) => {
    const input = ev.target.value;
    setSearchInput(input);
    debouncedSearch(input);
  };

  const handleSearch = async () => {
    debouncedSearch(searchInput);
  };

  const addBook = (book) => {
    console.log("Adding Book:", book);
    //Call bookService add google book function . use try catch!
  };

  return (
    <div>
      <h1> Add a Book</h1>
      <input
        type="text"
        placeholder="Search for a book"
        value={searchInput}
        onChange={handleInputChange}
      />
      <button onClick={handleSearch}>Search</button>
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            {book.title} <button onClick={() => addBook(book)}>+</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
