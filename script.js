const API_KEY = "MxpjFw4AFWnNrG8vUfNGZPeRwUcHc8cL2S15yXFZ";
const BASE = "https://api.watchmode.com/v1";

const modal = document.getElementById("modal");
const player = document.getElementById("player");
const closeBtn = document.getElementById("close");
const favBtn = document.getElementById("favBtn");

let currentMovie = null;

// FETCH MOVIES BY GENRE
async function fetchByGenre(genre) {
  const res = await fetch(`${BASE}/list-titles/?apiKey=${API_KEY}&types=movie&genres=${genre}&limit=10`);
  const data = await res.json();
  return data.titles;
}

// CREATE POSTER
function createPoster(movie) {
  const img = document.createElement("img");
  img.classList.add("poster");

  img.src = movie.poster || "https://via.placeholder.com/150x220";
  img.onclick = () => openModal(movie);

  return img;
}

// OPEN MODAL + TRAILER
async function openModal(movie) {
  currentMovie = movie;
  modal.classList.remove("hidden");

  // Fetch trailer
  const res = await fetch(`${BASE}/title/${movie.id}/details/?apiKey=${API_KEY}&append_to_response=videos`);
  const data = await res.json();

  const trailer = data.trailer || "";
  
  if (trailer.includes("youtube")) {
    player.src = trailer.replace("watch?v=", "embed/") + "?autoplay=1";
  } else {
    player.src = "";
  }
}

// CLOSE MODAL
closeBtn.onclick = () => {
  modal.classList.add("hidden");
  player.src = "";
};

// FAVORITES SYSTEM
favBtn.onclick = () => {
  let favs = JSON.parse(localStorage.getItem("favorites")) || [];

  if (!favs.find(f => f.id === currentMovie.id)) {
    favs.push(currentMovie);
  }

  localStorage.setItem("favorites", JSON.stringify(favs));
  loadFavorites();
};

// LOAD FAVORITES
function loadFavorites() {
  const container = document.getElementById("favorites");
  container.innerHTML = "";

  const favs = JSON.parse(localStorage.getItem("favorites")) || [];

  favs.forEach(movie => {
    container.appendChild(createPoster(movie));
  });
}

// LOAD CATEGORY
async function loadCategory(id, genre) {
  const container = document.getElementById(id);
  const movies = await fetchByGenre(genre);

  movies.forEach(movie => {
    container.appendChild(createPoster(movie));
  });
}

// INIT
loadCategory("action", 28);
loadCategory("horror", 27);
loadFavorites();
