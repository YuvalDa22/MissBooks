import { showErrorMsg } from "../services/event-bus.service.js";
import "../assets/style/cmps/add-review.css";

const { useState } = React;

export function AddReview({ bookId, onSaveReview }) {
  const [review, setReview] = useState({
    fullName: "",
    rating: 5,
    readAt: new Date().toISOString().split("T")[0],
  });

  const getSelectedStart = (value) => {
    return "⭐".repeat(value);
  };

  function handleChange({ target }) {
    const { name, value } = target;
    setReview((prevReview) => ({
      ...prevReview,
      [name]: value,
    }));
  }

  function onAddReview(ev) {
    ev.preventDefault();
    const { fullName, rating, readAt } = review;
    if (!fullName || !rating || !readAt) {
      showErrorMsg("Please fill in all fields");
      return;
    }
    onSaveReview(review);
  }

  function onCancel() {
    showErrorMsg("Review addition cancelled");
  }
  
  const { fullName, rating, readAt } = review;

  return (
    <section className="add-review">
      <h4>Add a Review</h4>
      <form className="add-review-form" onSubmit={onAddReview}>
        <div>
          <label htmlFor="fullName">Full Name:</label>
          <input
            value={fullName}
            onChange={handleChange}
            type="text"
            name="fullName"
            id="fullName"
            placeholder="Your name"
            required
          />
        </div>
        <div>
          <label htmlFor="rating">Rating</label>
          <div>
            <div className="selected-start">{getSelectedStart(rating)}</div>
            <input
              value={rating}
              onChange={handleChange}
              type="range"
              name="rating"
              id="rating"
              min="1"
              max="5"
            />
          </div>
          <span>{rating} Stars </span>
          {/*Display selected rating within change*/}
        </div>
        <div>
          <label htmlFor="readAt">Read At:</label>
          <input
            value={readAt}
            onChange={handleChange}
            type="date"
            name="readAt"
            id="readAt"
            required
          />
        </div>
        <button type="submit" className="btn">
          Add Review
        </button>
        <button onClick={onCancel} className="btn-cancel">
          Cancel
        </button>
      </form>
    </section>
  );
}
