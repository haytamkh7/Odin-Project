const myLibrary = [];

// Book Constructor
function Book(title, author, pages, publishYear, read) {
    const bookID = window.crypto.randomUUID();
    this.bookID = bookID;
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.publishYear = publishYear;
    this.read = read;

    this.getBookID = function () {
        return this.bookID;
    }

    this.getBookTitle = function () {
        return this.title;
    }

    this.getBookAuthor = function () {
        return this.author;
    }

    this.getBookPages = function () {
        return this.pages;
    }

    this.getBookPublishYear = function () {
        return this.publishYear;
    }

    this.getReadStatus = function () {
        return this.read ? 'Read' : 'Not read yet';
    }

    this.setReadStatus = function (readStatus) {
        this.read = readStatus;
    }
}

function addBookToLibrary(title, author, pages, publishYear, read) {
    myLibrary.push(new Book(title, author, pages, publishYear, read));
}

// Storing the currently editing book globally
let currentEditingBook = null;

function displayBooks() {
    const container = document.getElementById("book-container");
    container.innerHTML = "";

    myLibrary.forEach((book) => {
        const card = document.createElement("div");
        card.className = "book-card";
        card.innerHTML = `
            <h3>${book.getBookTitle()}</h3>
            <p><strong>Author:</strong> ${book.getBookAuthor()}</p>
            <p><strong>Pages:</strong> ${book.getBookPages()}</p>
            <p><strong>Published:</strong> ${book.getBookPublishYear()}</p>
            <p><strong>Read:</strong> ${book.getReadStatus()}</p>
            <button class="delete-book-btn" data-id="${book.getBookID()}">Delete</button>
            <button class="change-read-btn" data-id="${book.getBookID()}">Change Status</button>
        `;
        container.appendChild(card);
    });

    // Delete a book
    document.querySelectorAll(".delete-book-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const bookID = e.target.dataset.id;
            const index = myLibrary.findIndex(book => book.getBookID() === bookID);
            if (index !== -1) {
                myLibrary.splice(index, 1);
            }
            displayBooks();
        });
    });

    // Change read status
    document.querySelectorAll(".change-read-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const bookID = e.target.dataset.id;
            const book = myLibrary.find(book => book.getBookID() === bookID);
            if (book) {
                currentEditingBook = book;
                const checkbox = document.querySelector('input[name="new-read-status"]');
                checkbox.checked = book.read;
                document.getElementById("change-read-status-dialog").show();
            }
        });
    });
}

// Dialog elements
const newBookDialog = document.getElementById("new-book-dialog");
const readStatusDialog = document.getElementById("change-read-status-dialog");

// Open the new book dialog
document.getElementById("new-book-btn").addEventListener("click", () => {
    newBookDialog.show();
});

// Close the new book dialog
document.getElementById("cancel-btn").addEventListener("click", () => {
    newBookDialog.close();
});

// Close read status dialog
document.getElementById("cancel-read-status-btn").addEventListener("click", () => {
    readStatusDialog.close();
    currentEditingBook = null;
});

// Handle read status update
document.getElementById("read-status-form").addEventListener("submit", (e) => {
    e.preventDefault();
    if (currentEditingBook) {
        const newStatus = document.querySelector('input[name="new-read-status"]').checked;
        currentEditingBook.setReadStatus(newStatus);
        currentEditingBook = null;
        readStatusDialog.close();
        displayBooks();
    }
});

// Submit new book
const submitForm = document.getElementById("new-book-form");
submitForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const title = document.querySelector('input[name="title"]').value;
    const author = document.querySelector('input[name="author"]').value;
    const pages = document.querySelector('input[name="pages"]').value;
    const publishYear = document.querySelector('input[name="publish-year"]').value;
    const readStatus = document.querySelector('input[name="read-status"]').checked;

    addBookToLibrary(title, author, pages, publishYear, readStatus);
    submitForm.reset();
    newBookDialog.close();
});

// Show books button
document.getElementById("show-books-btn").addEventListener("click", () => {
    displayBooks();
});
