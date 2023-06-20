const listItems = document.querySelectorAll("li");
const paginationNumbers = document.getElementById("pagination-numbers");
const prevButton = document.getElementById("prev-button");
const listContainer = document.getElementById("list-container");
const nextButton = document.getElementById("next-button");
const itemsPerPage = 10;
let currentPage = 1;

function displayItems() {
const startIndex = (currentPage - 1) * itemsPerPage;
const endIndex = startIndex + itemsPerPage;

listContainer.innerHTML = ''; // Clear the existing content

for (let i = startIndex; i < endIndex; i++) {
  if (i < listItems.length) {
    const item = document.createElement('li');
    item.textContent = listItems[i].textContent;
    item.setAttribute("style", "margin-bottom: 10px;")
    listContainer.appendChild(item);
  }
}

listContainer.scrollTop = 0; 
}



function updatePaginationButtons() {
  prevButton.disabled = currentPage === 1;
  nextButton.disabled = currentPage === Math.ceil(listItems.length / itemsPerPage);
}

function appendPageNumber(index) {
  const pageNumber = document.createElement("button");
  pageNumber.textContent = index;
  pageNumber.setAttribute("page-index", index);
  pageNumber.addEventListener("click", () => {
    currentPage = index;
    displayItems();
    updatePaginationButtons();
  });
  paginationNumbers.appendChild(pageNumber);
}

function createPagination() {
  paginationNumbers.innerHTML = "";

  const totalPages = Math.ceil(listItems.length / itemsPerPage);
  for (let i = 1; i <= totalPages; i++) {
    appendPageNumber(i);
  }

  updatePaginationButtons();
}

prevButton.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    displayItems();
    updatePaginationButtons();
  }
});

nextButton.addEventListener("click", () => {
  const totalPages = Math.ceil(listItems.length / itemsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    displayItems();
    updatePaginationButtons();
  }
});

// Initial display
displayItems();
createPagination();

