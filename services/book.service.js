import { utilService } from "./util.service.js";
import { storageService } from "./async-storage.service.js";
import { booksDB } from "../books.js";

const BOOK_KEY = "bookDB";
_createBooks();

export const bookService = {
  query,
  get,
  remove,
  save,
  getEmptyBook,
  getDefaultFilter,
  getFilterFromSrcParams,
  getListPriceClass,
  addReview,
  removeReview,
};

function query(filterBy = {}) {
  return storageService.query(BOOK_KEY).then((books) => {
    if (filterBy.title) {
      const regExp = new RegExp(filterBy.title, "i");
      books = books.filter((book) => regExp.test(book.title));
    }
    if (filterBy.amount) {
      books = books.filter((book) => book.listPrice.amount >= filterBy.amount);
    }
    if (filterBy.subtitle) {
      const regExp = new RegExp(filterby.subtitle, "i");
      books = books.filter((book) => regExp.test(book.subtitle));
    }
    if (filterBy.pageCount) {
      books = books.filter((book) => book.pageCount >= filterBy.pageCount);
    }
    if (filterBy.authors) {
      const regExp = new regExp(filterBy.authors, "i");
      books = books.filter((book) => regExp.test(book.authors));
    }
    if (filterBy.categories) {
      const regExp = new regExp(filterBy.categories, "i");
      books = books.filter((book) => regExp.test(book.categories));
    }
    if (filterBy.onSale) {
      books = books.filter(
        (book) => book.listPrice.isOnSale === filterBy.onSale
      );
    }
    return books;
  });
}

function get(bookId) {
  return storageService.get(BOOK_KEY, bookId).then(_setNextPrevBookId);
}

function remove(bookId) {
  return storageService.remove(BOOK_KEY, bookId);
}

function save(book) {
  if (book.id) {
    return storageService.put(BOOK_KEY, book);
  } else {
    return storageService.post(BOOK_KEY, book);
  }
}

function getDefaultFilter() {
  return { title: "", amount: "" };
}

function getEmptyBook() {
  return {
    title: "",
    subtitle: "",
    authors: [],
    publishedDate: "",
    description: "",
    pageCount: "",
    categories: [],
    thumbnail: "",
    language: "en",
    listPrice: {
      amount: "",
      currencyCode: "",
      isOnSale: false,
    },
    reviews: [],
  };
}

function getFilterFromSrcParams(srcParams) {
  const title = srcParams.get("title") || "";
  const amount = srcParams.get("amount") || "";
  return {
    title,
    amount,
  };
}

function addReview(bookId, review) {
  review.id = utilService.makeId();
  return get(bookId)
    .then((book) => {
      book.reviews = [...book.reviews, review];
      return save(book).then(() => book.reviews);
    })
    .catch((err) => {
      console.error("Failed to save review:", err);
    });
}

function removeReview(bookId, reviewId) {
  return get(bookId)
    .then((book) => {
      if (!book || !book.reviews) {
        throw new Error("Book or reviews not found");
      }
      book.reviews = book.reviews.filter((review) => review.id !== reviewId);
      return save(book);
    })
    .catch((err) => {
      console.error("Failed to remove review:", err);
      throw err;
    });
}

function _setNextPrevBookId(book) {
  return query().then((books) => {
    const bookIdx = books.findIndex((currBook) => currBook.id === book.id);
    const nextBook = books[bookIdx + 1] ? books[bookIdx + 1] : books[0];
    const prevBook = books[bookIdx - 1]
      ? books[bookIdx - 1]
      : books[books.length - 1];
    book.nextBookId = nextBook.id;
    book.prevBookId = prevBook.id;
    return book;
  });
}

function _createBooks() {
  let books = utilService.loadFromStorage(BOOK_KEY);
  if (!books || !books.length) {
    books = booksDB;
    utilService.saveToStorage(BOOK_KEY, books);
  }
}

function getListPriceClass(book) {
  let listPriceClass = "";
  if (book.listPrice.amount < 11) listPriceClass = "low";
  if (book.listPrice.amount > 16) listPriceClass = "high";
  return listPriceClass;
}
