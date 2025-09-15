const showingContainer = document.querySelector("#showing-container");
const popularContainer = document.querySelector("#popular");

let now_playing_page = 1;
let popular_page = 1;

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
      <article class="movie-card">
        <img src="https://image.tmdb.org/t/p/w500${
          movie.poster_path
        }" alt="${title} poster" />
        <div class="info">
          <h2>${title}</h2>
          <p class="rating">Rating: ${
            Math.round(movie.vote_average * 10) / 10
          }/10 IMDb</p>
        </div>
      </article>
    `;
    })
    .join("");
  showingContainer.insertAdjacentHTML("beforeend", moviesHtml);
}

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
  window.addEventListener(
    "wheel",
    (e) => {
      const maxScroll = showingContainer.scrollWidth - window.innerWidth;
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
  showingContainer.addEventListener("mousedown", (e) => {
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
    const maxScroll = showingContainer.scrollWidth - window.innerWidth;

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
      e.preventDefault(); // Prevent scrolling
    },
    { passive: false }
  );

  showingContainer.addEventListener(
    "touchmove",
    (e) => {
      if (!isTouching) return;

      const touchX = e.touches[0].clientX;
      const deltaX = touchX - touchStartX;
      const maxScroll = showingContainer.scrollWidth - window.innerWidth;

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
