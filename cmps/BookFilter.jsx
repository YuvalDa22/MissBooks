import { utilService } from "../services/util.service.js";
const { useNavigate } = ReactRouterDOM
const { useState, useEffect, useRef } = React;

export function BookFilter({ defaultFilter, onSetFilter }) {
    
  const [filterByToEdit, setFilterByToEdit] = useState(defaultFilter);
  const onSetFilterDebounce = useRef(utilService.debounce(onSetFilter)).current;
  const navigate = useNavigate();

  useEffect(() => {
    if (filterByToEdit)
    onSetFilterDebounce(filterByToEdit);
  }, [filterByToEdit]);

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
    setFilterByToEdit((prevFilter) => ({ ...prevFilter, [field]: value }));
  }

  function onSubmitFilter(ev) {
    ev.preventDefault();
    onSetFilter(filterByToEdit);
  }

  const { title, amount, authors, subtitle, pageCount, categories, onSale } = filterByToEdit;
  return (
    <div>
    <section className="book-filter">
      <h3>Filter Our Books</h3>
      <form onSubmit={onSubmitFilter}>
        <label htmlFor="title">Title</label>
        <input
          value={title}
          onChange={handleChange}
          type="text"
          name="title"
          id="title"
        />
        <label htmlFor="amount">Price</label>
        <input
          value={amount}
          onChange={handleChange}
          type="number"
          name="amount"
          id="amount"
        />
        <label htmlFor="subtitle">Subtitle</label>
        <input
          value={subtitle}
          onChange={handleChange}
          type="text"
          name="subtitle"
          id="subtitle"
        />
        <label htmlFor="pageCount">Number of Pages</label>
        <input
          value={pageCount}
          onChange={handleChange}
          type="number"
          name="pageCount"
          id="pageCount"
        />
        <label htmlFor="categories">Categories</label>
        <input
          value={categories}
          onChange={handleChange}
          type="text"
          name="categories"
          id="categories"
        />
        <label htmlFor="authors">Authors</label>
        <input
          value={authors}
          onChange={handleChange}
          type="text"
          name="authors"
          id="authors"
        />
        <label htmlFor="onSale">On sale</label>
        <input
          type="checkbox"
          name="onSale"
          checked={onSale || false}
          onChange={handleChange}
        />
        <button>Submit</button>
      </form>
      </section>
      <button className="btn" onClick={() =>
      navigate('/book/edit')}>Add Book</button>
    </div>
  );
}
