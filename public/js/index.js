const sideScroll = document.querySelector(".side_scroll");
const showingContainer = document.querySelector("#showing-container");
const popularContainer = document.querySelector("#popular-container");

let now_playing_page = 1;
let popular_page = 1;

let genres = {};

// Fetch genres first to map genre IDs to names
fetch("/api/db/genres")
  .then((res) => res.json())
  .then((json) => {
    genres = json.genres;
    console.log(genres);
  })
  .catch((err) => console.error(err));

fetch(`/api/db/now_playing?page=${now_playing_page}`)
  .then((res) => res.json())
  .then((json) => {
    renderScrollMovies(json.results);
    setupHorizontalScroll();
  })
  .catch((err) => console.error(err));

fetch(`/api/db/popular?page=${popular_page}`)
  .then((res) => res.json())
  .then((json) => {
    console.log(json);
    renderPopularMovies(json.results);
  })
  .catch((err) => console.error(err));

function renderScrollMovies(movies) {
  let moviesHtml = movies
    .map((movie) => {
      let title =
        movie.title.length > 35
          ? movie.title.slice(0, 31) + "...."
          : movie.title;
      return `
      <article class="movie-card scrolling-card">
        <a href="details.html?id=${movie.id}" class="poster-link">
          <div class="poster-wrapper scrolling-poster">
            <img class="poster-bg" src="https://image.tmdb.org/t/p/w500${
              movie.poster_path
            }" alt="" />
            <img class="poster-main" src="https://image.tmdb.org/t/p/w500${
              movie.poster_path
            }" alt="${title} poster" />
          </div>
        </a>
        <div class="info scrolling-info">
          <a href="details.html?id=${movie.id}" class="title-link">
            <h2>${title}</h2>
          </a>
          <p class="rating">${
            Math.round(movie.vote_average * 10) / 10
          }/10 IMDb</p>
        </div>
      </article>
    `;
    })
    .join("");
  showingContainer.insertAdjacentHTML("beforeend", moviesHtml);
}

async function renderPopularMovies(movies) {
  // Fetch details for all movies in parallel
  const moviesWithDetails = await Promise.all(
    movies.map(async (movie) => {
      // Fetch details from your server endpoint
      const res = await fetch(`/api/db/movie/details/${movie.id}`);
      const details = await res.json();
      return { ...movie, runtime: details.runtime };
    })
  );

  let moviesHtml = moviesWithDetails
    .map((movie) => {
      let title =
        movie.title.length > 24
          ? movie.title.slice(0, 21) + "...."
          : movie.title;
      return `
      <article class="movie-card popular-card">
        <a href="details.html?id=${movie.id}" aria-label="${
        movie.title
      }" class="poster-link">
          <div class="poster-wrapper">
            <img class="poster-bg" src="https://image.tmdb.org/t/p/w500${
              movie.poster_path
            }" alt="" />
            <img class="poster-main" src="https://image.tmdb.org/t/p/w500${
              movie.poster_path
            }" alt="${title} poster" />
          </div>
        </a>
        <div class="info popular-info">
          <a href="details.html?id=${movie.id}" aria-label="${
        movie.title
      }" class="title-link">
            <h2>${title}</h2>
          </a>
          <p class="rating">${
            Math.round(movie.vote_average * 10) / 10
          }/10 IMDb</p>
          <ul class="genres">${movie.genre_ids
            .map(
              (id) =>
                `<li><a href="#">${
                  genres.find((genre) => genre.id == id).name
                }</a></li>`
            )
            .join(" ")}</ul>
          <p class="length">
            <svg width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M0 5.49997C0 2.82127 2.1793 0.641968 4.858 0.641968C7.5367 0.641968 9.716 2.82127 9.716 5.49997C9.716 8.17867 7.5367 10.358 4.858 10.358C2.1793 10.358 0 8.17867 0 5.49997ZM1.0336 5.49997C1.0336 7.60877 2.7493 9.32427 4.858 9.32427C6.9667 9.32427 8.6824 7.60877 8.6824 5.49997C8.6824 3.39117 6.9667 1.67567 4.858 1.67567C2.7493 1.67567 1.0336 3.39117 1.0336 5.49997Z" fill="black"/>
              <path d="M6.64531 6.01452H4.70939V3.95569C4.70939 3.78244 4.55057 3.64197 4.35469 3.64197C4.15881 3.64197 4 3.78244 4 3.95569V6.32824C4 6.5015 4.15881 6.64197 4.35469 6.64197H6.64531C6.84119 6.64197 7 6.5015 7 6.32824C7 6.15499 6.84119 6.01452 6.64531 6.01452Z" fill="black"/>
            </svg>
            ${
              movie.runtime
                ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
                : "N/A"
            }
          </p>
        </div>
      </article>
    `;
    })
    .join("");
  popularContainer.innerHTML = moviesHtml;
}

// Extremely overengineered horizontal scroll
function setupHorizontalScroll() {
  let currentX = 0;
  const scrollSpeed = 1;

  // Drag scrolling variables
  let isDragging = false;
  let startX = 0;
  let startScrollX = 0;

  // Touch scrolling variables
  let isTouching = false;
  let touchStartX = 0;
  let touchStartScrollX = 0;

  // Mouse wheel scrolling
  sideScroll.addEventListener(
    "wheel",
    (e) => {
      const maxScroll = showingContainer.scrollWidth - window.innerWidth + 42;
      if (maxScroll <= 0) return;

      let delta = e.deltaY !== 0 && e.shiftKey ? e.deltaY : e.deltaX;
      if (delta === 0) return;

      currentX -= delta * scrollSpeed;
      currentX = Math.max(Math.min(currentX, 0), -maxScroll);

      showingContainer.style.transform = `translateX(${currentX}px)`;
      e.preventDefault();
    },
    { passive: false }
  );

  // Mouse drag scrolling
  sideScroll.addEventListener("mousedown", (e) => {
    isDragging = true;
    startX = e.clientX;
    startScrollX = currentX;
    showingContainer.style.cursor = "grabbing";
    showingContainer.style.userSelect = "none";
    e.preventDefault();
  });

  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    const deltaX = e.clientX - startX;
    const maxScroll = showingContainer.scrollWidth - window.innerWidth + 42;

    currentX = startScrollX + deltaX;
    currentX = Math.max(Math.min(currentX, 0), -maxScroll);

    showingContainer.style.transform = `translateX(${currentX}px)`;
  });

  window.addEventListener("mouseup", () => {
    isDragging = false;
    showingContainer.style.cursor = "grab";
    showingContainer.style.userSelect = "";
  });

  showingContainer.addEventListener("mouseleave", () => {
    isDragging = false;
    showingContainer.style.cursor = "grab";
    showingContainer.style.userSelect = "";
  });

  // Touch events for mobile
  showingContainer.addEventListener(
    "touchstart",
    (e) => {
      isTouching = true;
      touchStartX = e.touches[0].clientX;
      touchStartScrollX = currentX;
      //e.preventDefault(); // Prevent scrolling
    },
    { passive: false }
  );

  showingContainer.addEventListener(
    "touchmove",
    (e) => {
      if (!isTouching) return;

      const touchX = e.touches[0].clientX;
      const deltaX = touchX - touchStartX;
      const maxScroll = showingContainer.scrollWidth - window.innerWidth + 42;

      currentX = touchStartScrollX + deltaX;
      currentX = Math.max(Math.min(currentX, 0), -maxScroll);

      showingContainer.style.transform = `translateX(${currentX}px)`;
      e.preventDefault(); // Prevent native scrolling
    },
    { passive: false }
  );

  showingContainer.addEventListener("touchend", () => {
    isTouching = false;
  });

  showingContainer.addEventListener("touchcancel", () => {
    isTouching = false;
  });

  // Set initial cursor for desktop
  showingContainer.style.cursor = "grab";
}
