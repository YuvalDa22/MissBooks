import { utilService } from "./util.service.js";
import { storageService } from "./async-storage.service.js";
import { booksDB } from "../books.js";
import axios from 'axios';


const BOOK_KEY = "bookDB";
const CACHE_STORAGE_KEY = "googleBooksCache";
const gCache = utilService.loadFromStorage(CACHE_STORAGE_KEY) || {};
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
  saveGoogleBook,
  searchGoogleBook,
};

window.bs = bookService;

// ~~~~~~~~~~~~~~~~~~~~ CRUDL ~~~~~~~~~~~~~~~~~~~~~~

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
  return storageService.get(BOOK_KEY, bookId).then((book) => {
    book = _setNextPrevBookId(book);
    return book;
  });
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

// ~~~~~~~~~~~~~~ CRUDL HELPERS ~~~~~~~~~~~~~~

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

function getListPriceClass(book) {
  let listPriceClass = "";
  if (book.listPrice.amount < 11) listPriceClass = "low";
  if (book.listPrice.amount > 16) listPriceClass = "high";
  return listPriceClass;
}

// ~~~~~~~~~~~~~~~~~~ Google Books ~~~~~~~~~~~~~~~~~~~~~~`
function saveGoogleBook(book) {
  return storageService
    .post(BOOK_KEY, book, { isCheckExist: true })
    .catch((err) => {
      if (err && err.isExist) {
        console.error(`"${book.title}" already in shop`);
      }
      throw err;
    });
}

function searchGoogleBook(bookName) {
  if (!bookName) return Promise.resolve();
  let { data: googleBooks, lastFetched = 0 } = gCache[bookName] || {};
  const isFetchStillValid = Date.now() - lastFetched < 60000;
  if (googleBooks && isFetchStillValid) {
    console.log("data from storage", googleBooks);
    return Promise.resolve(googleBooks);
  }

  const url = `https://www.googleapis.com/books/v1/volumes?printType=books&q=${bookName}`;
  return axios.get(url)
  .then((res) => {
    const data = res.data.items;
    const books = _formatGoogleBooks(data);
    console.log("data from network", books);
    _saveDataToCache(bookName, books);
    return books;
  });
}

//~~~~~~~~~~~~~~~~~ Reviews ~~~~~~~~~~~~~~~~~~~~~~~

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

// ~~~~~~~~~~~~~~~~LOCAL FUNCTIONS~~~~~~~~~~~~~~~~~

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

function _saveDataToCache(key, data) {
  gCache[key] = {
    data,
    lastFetched: Date.now(),
  };
  utilService.saveToStorage(CACHE_STORAGE_KEY, gCache);
}

function _formatGoogleBooks(googleBooks) {
  return googleBooks.map((googleBook) => {
    const { volumeInfo } = googleBook;
    const book = {
      id: googleBook.id,
      title: volumeInfo.title,
      description: volumeInfo.description,
      pageCount: volumeInfo.pageCount,
      authors: volumeInfo.authors,
      publishedDate: volumeInfo.publishedDate,
      language: volumeInfo.language,
      listPrice: {
        amount: utilService.getRandomIntInclusive(80, 450),
        currencyCode: "EUR",
        isOnSale: Math.random() > 0.7,
      },
      reviews: [],
    };
    if (volumeInfo.imageLinks) book.thumbnail = volumeInfo.imageLinks.thumbnail;
    return book;
  });
}
