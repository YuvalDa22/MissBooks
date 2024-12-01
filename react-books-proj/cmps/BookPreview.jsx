export function BookPreview({ book }) {
    
//Extract the image number from the thumbnail field
const match = book.thumbnail.match(/\/(\d+)\.jpg$/);
const bookImg = match ? parseInt(match[1], 10) : null;

    return (
        <article className="book-preview">
            <h2>Title: {book.title}</h2>
            <h4>Book Amount: {book.listPrice.amount} {book.listPrice.currencyCode}</h4>
            <img src={`../assets/img/${bookImg}.jpg`} alt={`${book.title} image`} />
        </article>
    );
}
