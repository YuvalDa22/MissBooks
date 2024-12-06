import { bookService } from "../services/book.service.js";
const { useEffect, useState } = React;
const { useParams, useNavigate, Link } = ReactRouterDOM;

export function BookDetails() {
  const [book, setBook] = useState(null);
  const [bookImg, setBookImg] = useState(null);
  const params = useParams();
  const navigate = useNavigate();
  

  useEffect(() => {
    loadBooks();
  }, [params.bookId]);

  console.log(params)


  function loadBooks() {
    bookService
      .get(params.bookId)
      .then(book => {
        setBook(book);
        const {bookImg} = getBookImg(book)
        setBookImg(bookImg);
      })
      .catch((err) => {
        console.log("Problem getting book", err);
      });
  }

  function getBookImg(book){
    if(!book || !book.thumbnail) {
      console.error("Invalid book or thumbnail")
      return { bookImg: null};
    }
    //Extract the image number from the thumbnail field
    const match = book.thumbnail.match(/\/(\d+)\.jpg$/);
    const bookImg = match ? parseInt(match[1], 10) : null;
    return{
      bookImg
    }
  }
  
  function onBack() {
    navigate("/book");
  }

  console.log("Render");

  if (!book || bookImg === null ) return <div>Details Loading...</div>;
  return (
    <section className="book-details">
      <h1>Book Title: {book.title}</h1>
      <h1>Book Price: {book.listPrice.amount}</h1>
      <h1>Book Author: {book.authors}</h1>
      <h1>Book Description: {book.description}</h1>
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
