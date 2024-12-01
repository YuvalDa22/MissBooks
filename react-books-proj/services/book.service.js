import { utilService } from "./util.service.js"
import { storageService } from "./async-storage.service.js"
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
};

function query(filterBy = {}) {
  return storageService.query(BOOK_KEY)
  .then(books => {
    if (filterBy.txt) {
      const regExp = new RegExp(filterBy.txt, "i");
      books = books.filter(book => regExp.test(book.title));
    }
    if (filterBy.amount) {
      books = books.filter(book => book.amount >= filterBy.amount);
    }
    return books;
  });
}

function get(bookId) {
  return storageService.get(BOOK_KEY, bookId);
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
  return { title: "", amount: "" }
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
  };

}

function _createBooks(){
  let books = utilService.loadFromStorage(BOOK_KEY)
  console.log(books)
  if (!books || !books.length) {
    books = booksDB
    utilService.saveToStorage(BOOK_KEY, books)
  }
  console.log(books)
}
