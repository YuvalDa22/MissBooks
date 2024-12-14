export function BookPreview({ book }) {


  // TODO: Fix to cases where book has no img
  //Extract the image number from the thumbnail field
    const match = book.thumbnail.match(/\/(\d+)\.jpg$/) || "";
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
  const classNameSale = book.listPrice.isOnSale ? "on-sale" : "";

  return (
    <div>
      <div>
        <article className="book-preview">
          <h3>Title: {book.title} </h3>
          <h5>Author: {book.authors} </h5>
          <h5
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
          </h5>
          <h5 className={classNamePages}>
            {`Number of pages: ${book.pageCount} - ${classNamePages}`}
          </h5>
          <h5 className={classNamePublishDate}>
            {`Publish Date: ${book.publishedDate} - ${classNamePublishDate}`}
          </h5>
          <h3
            className="on-sale"
            style={{ color: book.listPrice.isOnSale ? "red" : "transparent" }}
          >
            {`${classNameSale}!`}
          </h3>
          <img
            src={`../assets/img/${bookImg}.jpg`}
            alt={`${book.title} image`}
          />
        </article>
      </div>
    </div>
  );
}
