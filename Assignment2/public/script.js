const API_URL = '/api/books';

const bookForm = document.getElementById('book-form');
const bookIdInput = document.getElementById('book-id');
const titleInput = document.getElementById('title');
const authorInput = document.getElementById('author');
const bookList = document.getElementById('book-list');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const formTitle = document.getElementById('form-title');

async function fetchBooks() {
  const res = await fetch(API_URL);
  const books = await res.json();
  renderBooks(books);
}

function renderBooks(books) {
  bookList.innerHTML = '';
  books.forEach(book => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span><strong>${book.title}</strong> by ${book.author}</span>
      <div class="actions">
        <button class="edit-btn" onclick="prepareEdit(${book.id}, '${escapeQuotes(book.title)}', '${escapeQuotes(book.author)}')">Edit</button>
        <button class="delete-btn" onclick="deleteBook(${book.id})">Delete</button>
      </div>
    `;
    bookList.appendChild(li);
  });
}

function escapeQuotes(str) {
  return str.replace(/'/g, "\\'");
}

bookForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = bookIdInput.value;
  const title = titleInput.value.trim();
  const author = authorInput.value.trim();

  if (id) {
    await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, author })
    });
  } else {
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, author })
    });
  }

  resetForm();
  fetchBooks();
});

function prepareEdit(id, title, author) {
  bookIdInput.value = id;
  titleInput.value = title;
  authorInput.value = author;
  formTitle.textContent = 'Edit Book';
  submitBtn.textContent = 'Update Book';
  cancelBtn.style.display = 'inline-block';
}

cancelBtn.addEventListener('click', resetForm);

function resetForm() {
  bookIdInput.value = '';
  titleInput.value = '';
  authorInput.value = '';
  formTitle.textContent = 'Add New Book';
  submitBtn.textContent = 'Add Book';
  cancelBtn.style.display = 'none';
}

async function deleteBook(id) {
  if (confirm('Kya aap is book ko delete karna chahte hain?')) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchBooks();
  }
}

fetchBooks();