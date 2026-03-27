const API_KEY = "4f03059d";

const movieTitles = [
  { title: "The Fast and the Furious", year: 2001 },
  { title: "2 Fast 2 Furious", year: 2003 },
  { title: "The Fast and the Furious: Tokyo Drift", year: 2006 },
  { title: "Fast & Furious", year: 2009 },
  { title: "Fast Five", year: 2011 },
  { title: "Fast & Furious 6", year: 2013 },
  { title: "Furious 7", year: 2015 },
  { title: "The Fate of the Furious", year: 2017 },
  { title: "F9", year: 2021 },
  { title: "Fast X", year: 2023 }
];

let movies = [];

async function fetchMovies() {
  try {
    const promises = movieTitles.map((movie) =>
      fetch(
        `https://www.omdbapi.com/?apikey=${API_KEY}&t=${encodeURIComponent(
          movie.title
        )}&y=${movie.year}`
      ).then((res) => res.json())
    );

    function scrollToTop(event) {
  event.preventDefault();

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

    const movieResults = await Promise.all(promises);

    movies = movieResults.map((movie, index) => ({
      id: index + 1,
      title: movie.Title,
      year: Number(movie.Year),
      order: index + 1,
      poster:
        movie.Poster && movie.Poster !== "N/A"
          ? movie.Poster
          : "https://via.placeholder.com/300x450?text=No+Image",
      description:
        movie.Plot && movie.Plot !== "N/A"
          ? movie.Plot
          : "No description available."
    }));

    renderMovies(movies);
  } catch (error) {
    const moviesList = document.getElementById("moviesList");
    moviesList.innerHTML = `<p class="error-message">Failed to load movies.</p>`;
    console.error(error);
  }
}

function movieCardHTML(movie) {
  return `
    <div class="movie">
      <div class="movie__card">
        <figure class="movie__poster--wrapper">
          <img class="movie__poster" src="${movie.poster}" alt="${movie.title} poster">
        </figure>
        <div class="movie__body">
          <div class="movie__top">
            <h3 class="movie__title">${movie.title}</h3>
            <span class="movie__year">${movie.year}</span>
          </div>
          <p class="movie__subtitle">Film #${movie.order} in the franchise</p>
          <p class="movie__description">${movie.description}</p>
        </div>
      </div>
    </div>
  `;
}

function renderMovies(movieArray) {
  const moviesList = document.getElementById("moviesList");
  moviesList.innerHTML = movieArray.map((movie) => movieCardHTML(movie)).join("");
}

function sortMovies(event) {
  const value = event.target.value;
  const sortedMovies = [...movies];

  if (value === "A_TO_Z") {
    sortedMovies.sort((a, b) => a.title.localeCompare(b.title));
  } else if (value === "Z_TO_A") {
    sortedMovies.sort((a, b) => b.title.localeCompare(a.title));
  } else if (value === "NEW_TO_OLD") {
    sortedMovies.sort((a, b) => b.year - a.year);
  } else if (value === "OLD_TO_NEW") {
    sortedMovies.sort((a, b) => a.year - b.year);
  }

  renderMovies(sortedMovies);
}

fetchMovies();