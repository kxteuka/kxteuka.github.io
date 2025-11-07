/* === Reloj con segundos === */
const clockEl = document.getElementById("clock");
function updateClock() {
  const now = new Date();
  const opts = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
  clockEl.textContent = now.toLocaleTimeString('es-ES', opts);
}
setInterval(updateClock, 1000);
updateClock();

/* === Reproductor de música Aero === */
const player = {
  audio: document.getElementById('mp-audio'),
  playBtn: document.getElementById('mp-play'),
  progress: document.getElementById('mp-progress'),
  volume: document.getElementById('mp-volume'),
  title: document.getElementById('mp-title'),
};

const playlist = [
  { title: "windows breakcore – proløxx", src: "assets/windows_breakcore.mp3" },
];
let current = 0;

// "Now playing" text
const nowPlayingText = document.getElementById("now-playing-text");
function updateNowPlaying(title) {
  nowPlayingText.textContent = `Now playing: ${title}`;
}

function loadSong(i) {
  const song = playlist[i];
  player.audio.src = song.src;
  player.audio.load();
  player.audio.loop = true; // 🔁 bucle infinito
  player.title.textContent = song.title || "Sin título";
  updateNowPlaying(song.title || "Sin título");
  player.progress.value = 0;
}
loadSong(current);

player.playBtn.addEventListener("click", () => {
  if (!player.audio.src) return;
  if (player.audio.paused) {
    player.audio.play().then(() => {
      player.playBtn.textContent = "⏸";
      updateNowPlaying(playlist[current].title);
    }).catch(err => console.log("Interacción requerida:", err));
  } else {
    player.audio.pause();
    player.playBtn.textContent = "▶";
  }
});

player.audio.addEventListener("timeupdate", () => {
  if (player.audio.duration) {
    player.progress.max = player.audio.duration;
    player.progress.value = player.audio.currentTime;
  }
});

player.progress.addEventListener("input", () => {
  player.audio.currentTime = player.progress.value;
});

player.volume.addEventListener("input", () => {
  player.audio.volume = player.volume.value;
});