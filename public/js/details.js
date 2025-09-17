document.addEventListener("DOMContentLoaded", () => {
  const detailsContainer = document.getElementById("details-container");
  const cover = document.getElementById("cover");

  // Get movie ID from URL
  const params = new URLSearchParams(window.location.search);
  const movieId = params.get("id");

  if (!movieId) {
    detailsContainer.innerHTML = "<p>Movie ID not found.</p>";
    return;
  }

  // Fetch movie details from the server
  fetch(`/api/db/movie/details/${movieId}`)
    .then((res) => res.json())
    .then((movie) => {
      console.log(movie);
      renderMovieDetails(movie);
    })
    .catch((err) => {
      console.error(err);
      detailsContainer.innerHTML = "<p>Error loading movie details.</p>";
    });
});

function getCertification(movie) {
  // The release_dates object contains an array of results for different countries
  const usRelease = movie.release_dates.results.find(
    (result) => result.iso_3166_1 === "US"
  );

  if (usRelease && usRelease.release_dates) {
    // Find the first release that has a non-empty certification string
    const rating = usRelease.release_dates.find(
      (release) => release.certification !== ""
    );
    return rating ? rating.certification : "N/A";
  }

  return "N/A"; // Return 'N/A' if no US rating is found
}

function renderMovieDetails(movie) {
  const detailsContainer = document.getElementById("details-container");
  const cover = document.getElementById("cover");

  // Format data
  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : "N/A";
  const rating = Math.round(movie.vote_average * 10) / 10;
  const genres = movie.genres
    .map((genre) => `<li><a href="#">${genre.name}</a></li>`)
    .join("");
  const certification = getCertification(movie); // Get the certification

  const bookmark = `
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect opacity="0.01" width="24" height="24" fill="#D8D8D8"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M19.1002 2.11908C19.375 2.23363 19.5939 2.4142 19.7564 2.6611C19.9187 2.90788 20 3.18095 20 3.48065V20.5195C20 20.8192 19.9188 21.0923 19.7564 21.3389C19.5938 21.586 19.3749 21.7667 19.1002 21.8811C18.9418 21.9517 18.7584 21.9867 18.55 21.9867C18.1502 21.9867 17.8043 21.8456 17.5126 21.5641L12 15.9588L6.48747 21.5639C6.18739 21.8545 5.84173 22 5.44992 22C5.25829 22 5.07489 21.9604 4.90002 21.8812C4.62507 21.7668 4.40625 21.586 4.24378 21.3393C4.08135 21.0923 4 20.8193 4 20.5195V3.48047C4 3.18077 4.08135 2.9077 4.24378 2.66092C4.40625 2.41415 4.62507 2.23335 4.90002 2.1189C5.07506 2.03967 5.25829 2 5.44992 2H18.5501V2.00018C18.7418 2.00018 18.9252 2.03987 19.1002 2.11908ZM13.1126 14.7427L18.4001 20.1095V3.6922H5.60016V20.1095L10.8876 14.7427L12.0001 13.6193L13.1126 14.7427Z" fill="#BCBCCD"/>
  </svg>
  `;

  const detailsHtml = `
    <div class="details-content">
        <div class="title-header">
          <h1>${movie.title}</h1>
          <span class="bookmark-icon">${bookmark}</span>
        </div>
        <span class="rating">${rating}/10 IMDb</span>
        
        <ul class="genres">
            ${genres}
        </ul>

        <div class="details-meta-grid">
          <div>
            <span>Length</span>
            <strong>${runtime}</strong>
          </div>
          <div>
            <span>Language</span>
            <strong>${movie.original_language.toUpperCase()}</strong>
          </div>
          <div>
            <span>Rating</span>
            <strong>${certification}</strong>
          </div>
        </div>

        <h2 class="desc_header">Description</h2>
        <p class="overview">${movie.overview}</p>

        <div class="area_header">
          <h2>Cast</h2>
          <button>See More</button>
        </div>
        <ul class="cast-list">
          ${movie.credits.cast
            .slice(0, 10)
            .map(
              (cast) => `
            <li class="cast-card">
              <img src="${
                cast.profile_path
                  ? `https://image.tmdb.org/t/p/w200${cast.profile_path}`
                  : "https://via.placeholder.com/200x300?text=No+Image"
              }" alt="${cast.name}" />
              <p class="cast-name">${cast.name}</p>
            </li>
          `
            )
            .join("")}
        </ul>
    </div>
  `;

  const coverHtml = `
    <nav class="details-top-bar">
      <a href="javascript:history.back()" class="back-button">
        &#x2190;
      </a>
      <label class="mode_toggle">
        <input type="checkbox" id="darkModeToggle" />
        <span class="slider round"></span>
      </label>
    </nav>

    <div class="details-backdrop" style="background-image: url('https://image.tmdb.org/t/p/w1280${movie.backdrop_path}')">
      <div class="play-button-wrapper">
        <div class="play-button"></div>
        <span>Play Trailer</span>
      </div>
    </div>
  `;

  detailsContainer.innerHTML = detailsHtml;
  cover.innerHTML = coverHtml;

  // Re-run the setup for the newly added toggle switch
  setupDarkModeToggle();
}
