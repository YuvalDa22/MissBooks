import { LongTxt } from "../cmps/LongTxt.jsx";
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

  console.log(params);

  function loadBooks() {
    bookService
      .get(params.bookId)
      .then((book) => {
        setBook(book);
        const { bookImg } = getBookImg(book);
        setBookImg(bookImg);
      })
      .catch((err) => {
        console.log("Problem getting book", err);
      });
  }

  function getBookImg(book) {
    if (!book || !book.thumbnail) {
      console.error("Invalid book or thumbnail");
      return { bookImg: null };
    }
    //Extract the image number from the thumbnail field
    const match = book.thumbnail.match(/\/(\d+)\.jpg$/);
    const bookImg = match ? parseInt(match[1], 10) : null;
    return {
      bookImg,
    };
  }

  function onBack() {
    navigate("/book");
  }

  console.log("Render");

  if (!book || bookImg === null) return <div>Details Loading...</div>;
  const listPriceClass = bookService.getListPriceClass(book); 
  const description = book.description || '';
  const {
    title,
    subtitle,
    authors,
    publishedDate,
    categories,
    pageCount,
    language,
    prevBookId,
    nextBookId,
  } = book;

  return (
    <section className="book-details">
      <h3>Book Title: {title}</h3>
      <h4>Book Author: {authors.join(",")}</h4>
      <h4>
        Book Price:
        <span className={listPriceClass}>
          {listPriceClass.amount} {listPriceClass.currencyCode}
        </span>
      </h4>
      <h4>Publish year: {publishedDate} </h4>
      <h4>Categories: {categories.join(",")}</h4>
      <h4>Number op Pages: {pageCount}</h4>
      <h4>Language: {language}</h4>
      <h4>Subtitle: {subtitle} </h4>
      <h4>
        Book Description: <LongTxt txt={description} length={100}/>
      </h4>
      <img src={`../assets/img/${bookImg}.jpg`} alt={`${title} image`} />
      
      <section>
        <button onClick={onBack}>Back</button>
        <button>
          <Link to={`/book/${prevBookId}`}>Prev Book</Link>
        </button>
        <button>
          <Link to={`/book/${nextBookId}`}>Next Book</Link>
        </button>
      </section>
    </section>
  );
}
