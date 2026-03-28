const API_KEY = "4f03059d";

let allMovies = [];
let displayedMovies = [];
let currentSort = "";

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const statusMessage = document.getElementById("status-message");
const moviesContainer = document.getElementById("movie-container");
const sortFilter = document.getElementById("sortFilter");

async function fetchMovies(searchTerm = "Fast & Furious") {
  try {
    showStatus("Loading movies...");
    moviesContainer.innerHTML = "";

    const response = await fetch(
      `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(searchTerm)}`
    );

    const data = await response.json();

    if (data.Response === "False") {
      allMovies = [];
      displayedMovies = [];
      moviesContainer.innerHTML = "";
      showStatus(data.Error || "No movies found.");
      return;
    }

    const detailedMovies = await Promise.all(
      data.Search.map(async (movie) => {
        const detailResponse = await fetch(
          `https://www.omdbapi.com/?apikey=${API_KEY}&i=${movie.imdbID}`
        );
        return await detailResponse.json();
      })
    );

    allMovies = detailedMovies;
    displayedMovies = [...allMovies];

    applySort();
    renderMovies(displayedMovies);
    clearStatus();
  } catch (error) {
    console.error("Error fetching movies:", error);
    moviesContainer.innerHTML = "";
    showStatus("Something went wrong while fetching movies.");
  }
}

function renderMovies(movies) {
  if (!movies.length) {
    moviesContainer.innerHTML = "";
    showStatus("No movies found.");
    return;
  }

  moviesContainer.innerHTML = movies
    .map((movie) => {
      return `
        <div class="movie">
          <figure class="movie__img--wrapper">
            <img
              class="movie__img"
              src="${
                movie.Poster && movie.Poster !== "N/A"
                  ? movie.Poster
                  : "https://via.placeholder.com/300x450?text=No+Poster"
              }"
              alt="${movie.Title}"
            >
          </figure>
          <div class="movie__body">
            <h3 class="movie__title">${movie.Title}</h3>
            <p class="movie__year">${movie.Year || "N/A"}</p>
            <p class="movie__type">${movie.Type || "N/A"}</p>
            <p class="movie__rating">IMDb: ${movie.imdbRating || "N/A"}</p>
          </div>
        </div>
      `;
    })
    .join("");
}

function applySort() {
  if (currentSort === "A_TO_Z") {
    displayedMovies.sort((a, b) => a.Title.localeCompare(b.Title));
  } else if (currentSort === "Z_TO_A") {
    displayedMovies.sort((a, b) => b.Title.localeCompare(a.Title));
  } else if (currentSort === "NEW_TO_OLD") {
    displayedMovies.sort((a, b) => getYear(b.Year) - getYear(a.Year));
  } else if (currentSort === "OLD_TO_NEW") {
    displayedMovies.sort((a, b) => getYear(a.Year) - getYear(b.Year));
  }
}

function getYear(yearString) {
  if (!yearString) return 0;
  const match = yearString.match(/\d{4}/);
  return match ? Number(match[0]) : 0;
}

function sortMovies(event) {
  currentSort = event.target.value;
  displayedMovies = [...allMovies];
  applySort();
  renderMovies(displayedMovies);
}

function showStatus(message) {
  statusMessage.textContent = message;
}

function clearStatus() {
  statusMessage.textContent = "";
}

function scrollToTop(event) {
  event.preventDefault();
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const searchTerm = searchInput.value.trim();

  if (!searchTerm) {
    fetchMovies("Fast & Furious");
    return;
  }

  fetchMovies(searchTerm);
});

window.sortMovies = sortMovies;
window.scrollToTop = scrollToTop;

document.addEventListener("DOMContentLoaded", () => {
  fetchMovies("Fast & Furious");
});