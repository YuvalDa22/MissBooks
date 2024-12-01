import { bookService } from "../services/book.service.js";

const { useEffect, useState } = React;
const { useParams, useNavigate, Link } = ReactRouterDOM;


////////////////
//TODO: Refactor the <BookDetails> component to use the full data model.



export function BookDetails() {
  const [book, setBook] = useState(null);
  const params = useParams();
  const navigate = useNavigate();
  //Extract the image number from the thumbnail field
  const match = book.thumbnail.match(/\/(\d+)\.jpg$/);
  const bookImg = match ? parseInt(match[1], 10) : null;

  console.log(bookImg);

  useEffect(() => {
    loadBooks();
  }, [params.bookId]);

  function loadBooks() {
    bookService
      .get(params.bookId)
      .then(setBook)
      .catch((err) => {
        console.log("Problem getting book", err);
      });
  }

  function onBack() {
    navigate("/book");
  }

  console.log("Render");

  if (!book) return <div>Details Loading...</div>;
  return (
    <section className="book-details">
      <h1>Book Title: {book.title}</h1>
      <h1>Book Amout: {book.amount}</h1>
      <img src={`../assets/img/${bookImg}.jpg`} alt={`${book.title} image`} />
      <button onClick={onBack}>Back</button>
      <section>
        <button>
          <Link to={`/book/${book.prevBookId}`}>Prev Book</Link>
        </button>
        <button>
          <Link to={`/book/${book.nextBookId}`}>Next Book</Link>
        </button>
      </section>
    </section>
  );
}
