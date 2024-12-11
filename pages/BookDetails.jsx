import { AddReview } from "../cmps/AddReview.jsx";
import { LongTxt } from "../cmps/LongTxt.jsx";
import { bookService } from "../services/book.service.js";
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js";
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

  function loadBooks() {
    bookService
      .get(params.bookId)
      .then((book) => {
        setBook(book);
        setBookImg(book.thumbnail);
      })
      .catch((err) => {
        console.log("Problem getting book", err);
        showErrorMsg("Sorry, couldn't load books");
      });
  }

  function saveReview(review) {
    bookService
      .addReview(book.id, review)
      .then((updatedReviews) => {
        setBook({ ...book, reviews: updatedReviews });
        showSuccessMsg("Review added successfully");
      })
      .catch((err) => {
        console.error("Failed to save review:", err);
        showErrorMsg("Failed to save review, please try again.");
      });
  }

  function onRemoveReview(reviewId) {
    bookService
      .removeReview(book.id, reviewId)
      .then(() => {
        setBook((prevBook) => ({
          ...prevBook,
          reviews: prevBook.reviews.filter((review) => review.id !== reviewId),
        }));
        showSuccessMsg("Review removed successfully");
      })
      .catch((err) => {
        console.error("Failed to remove review:", err);
        showErrorMsg("Couldn't remove review, please try again.");
      });
  }

  function onBack() {
    navigate("/book");
  }

  if (!book) return <div>Details Loading...</div>;
  const listPriceClass = bookService.getListPriceClass(book);
  const {
    id,
    title,
    description,
    subtitle,
    authors,
    publishedDate,
    categories,
    pageCount,
    language,
    prevBookId,
    nextBookId,
    reviews,
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
        Book Description: <LongTxt children={description} length={100} />
      </h4>
      <h4>
        <AddReview bookId={id} onSaveReview={saveReview} />
      </h4>
      <h4>Reviews:</h4>
      {reviews && reviews.length > 0 ? (
        <ul className="review-list">
          {reviews.map((review) => (
            <li key={review.id}>
              <button
                className="review-remove"
                onClick={() => onRemoveReview(review.id)}
              >
                Remove
              </button>
              <h4 className="review-fullName">Full Name: {review.fullName}</h4>
              <h4 className="review-rating">Rating: {review.rating}</h4>
              <h4 className="review-readAt">
                Book was read at: {review.readAt}
              </h4>
            </li>
          ))}
        </ul>
      ) : (
        <p>No reviews yet. Be the first to review this book!</p>
      )}
      {bookImg && <img src={bookImg} alt={`${title} cover`} />}

      <section>
        <button onClick={onBack}>Back</button>
        {prevBookId && (
          <button>
            <Link to={`/book/${prevBookId}`}>Prev Book</Link>
          </button>
        )}
        {nextBookId && (
          <button>
            <Link to={`/book/${nextBookId}`}>Next Book</Link>
          </button>
        )}
      </section>
    </section>
  );
}
