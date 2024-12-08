import { bookService } from "../services/book.service.js";

const { useState, useEffect } = React;
const { useNavigate, useParams, useSearchParams } = ReactRouterDOM;

export function BookEdit() {
  const [bookToEdit, setBookToEdit] = useState(bookService.getEmptyBook());
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();
  const { bookId } = useParams();

  useEffect(() => {
    if (bookId) loadBook(bookId);
  }, [bookId]);

  function loadBook(bookId) {
    bookService.get(bookId).then((book) => {
      setBookToEdit({
        ...book,
        authors: book.authors.join(","),
        categories: book.categories.join(","),
      });
    });
  }

  function handleChange({ target }) {
    let { value, name: field } = target;
    switch (target.type) {
      case "range":
      case "number":
        value = +target.value;
        break;
      case "checkbox":
        value = target.checked;
        break;
    }
    setBookToEdit((prevBook) => ({ ...prevBook, [field]: value }));
  }

  function handleBookPriceChange({ target }) {
    //destructing event
    let { value, name: field } = target
        switch (target.type) {
            case 'range':
            case 'number':
                value = +target.value
                break
            case 'checkbox':
                value = target.checked
                break
        }
    setBookToEdit((prevBook) => ({
      ...prevBook,
      listPrice: {
        ...prevBook.listPrice,
        [field]: value,
      },
    }));
  }

  function onSaveBook(ev) {
    console.log(ev);
    ev.preventDefault();
    const bookToSave = {
      ...bookToEdit,
      authors: bookToEdit.authors.split(",").map((author) => author.trim()),
      categories: bookToEdit.categories
        .split(",")
        .map((category) => category.trim()),
    };
    bookService.save(bookToSave).then(onBack);
  }

  function onBack() {
    const isDetails = searchParams.get("isDetails") === "true";
    navigate(isDetails ? `/book/${book.id}` : "/book");
  }

  const { title, listPrice, subtitle, pageCount, categories, authors } =
    bookToEdit;
  return (
    <section className="book-edit">
      <h1>{bookId ? "Edit" : "Add"} Book</h1>
      <form className="book-edit-form" onSubmit={onSaveBook}>
        <label htmlFor="title">Title</label>
        <input
          onChange={handleChange}
          value={title}
          type="text"
          name="title"
          id="title"
        />

        <label htmlFor="amount">Price</label>
        <input
          onChange={handleBookPriceChange}
          value={listPrice.amount}
          type="number"
          name="amount"
          id="amount"
        />

        <label htmlFor="subtitle">Subtitle</label>
        <input
          onChange={handleChange}
          value={subtitle}
          type="text"
          name="subtitle"
          id="subtitle"
        />

        <label htmlFor="pageCount">Number of Pages</label>
        <input
          onChange={handleChange}
          value={pageCount}
          type="text"
          name="pageCount"
          id="pageCount"
        />

        <label htmlFor="categories">Categories</label>
        <input
          onChange={handleChange}
          value={categories}
          type="text"
          name="categories"
          id="categories"
        />

        <label htmlFor="authors">Authors</label>
        <input
          onChange={handleChange}
          value={authors}
          type="text"
          name="authors"
          id="authors"
        />

        <label htmlFor="onSale">On sale</label>
        <input
          type="checkbox"
          name="onSale"
          checked={listPrice.isOnSale}
          onChange={handleBookPriceChange}
        />

        <button type="submit" className="btn">
          {bookId ? "Edit Book" : "Add New Book"}
        </button>
        <button onClick={onBack}>Cancel</button>
      </form>
    </section>
  );
}
