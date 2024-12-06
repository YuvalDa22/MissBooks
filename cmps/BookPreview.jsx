export function BookPreview({ book, removeBook }) {
  
  const { useNavigate } = ReactRouterDOM
  const navigate = useNavigate()

  //Extract the image number from the thumbnail field
  const match = book.thumbnail.match(/\/(\d+)\.jpg$/);
  const bookImg = match ? parseInt(match[1], 10) : null;

  const classNamePages =
    book.pageCount > 500
      ? "serious-reading"
      : book.pageCount > 200
      ? "decent-reading"
      : "light-reading";

  const tenYearsAgo = new Date().getFullYear() - 10;

  const classNamePublishDate =
    book.publishedDate > tenYearsAgo ? "new" : "vintage";
   const classNameSale = 
   book.listPrice.isOnSale ? "on-sale" : "";

  return (
    <div className = "book-box" >
      <div>
    <article className="book-preview">
      <h2>Title: {book.title} </h2>
      <h3>Author: {book.authors} </h3>
      <h4
        style={{
          color:
            book.listPrice.amount >= 150
              ? "red"
              : book.listPrice.amount < 20
              ? "green"
              : "black",
        }}
      >
        Price: {book.listPrice.amount} {book.listPrice.currencyCode}
      </h4>
      <h4 className={classNamePages}>
        {`Number of pages: ${book.pageCount} - ${classNamePages}`}
      </h4>
      <h4 className={classNamePublishDate}>
        {`Publish Date: ${book.publishedDate} - ${classNamePublishDate}`}
      </h4>
      <h4 className="on-sale" style = {{color: book.listPrice.isOnSale ? "red" : "transparent"}}> {`${classNameSale}!`}</h4>
      <img src={`../assets/img/${bookImg}.jpg`} alt={`${book.title} image`} />
    </article>
    </div>
    <div className = "preview-btn">
      <button onClick = {()=> navigate (`/book/${book.id}`)}>Select Book</button>
      <button onClick = {() => removeBook(book.id)}>Remove Book</button>
      <button onClick = {() => navigate(`/book/edit/${book.id}`)}>Edit Book</button>
    </div>
    </div>

  );
}