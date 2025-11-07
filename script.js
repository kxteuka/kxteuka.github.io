/* ============================
   Miku OS — iván's Desktop
   ============================ */

/* CONFIG — añade tus enlaces aquí */
const APPS = [
  {
    id: 'github',
    nombre: 'GitHub',
    url: 'https://github.com/kxeuka', // TODO: cambia por tu perfil
    desc: 'Repositorio y proyectos.',
    icono: '◆'
  },
  {
    id: 'portfolio',
    nombre: 'Portfolio',
    url: 'https://tu-dominio.com', // TODO
    desc: 'Muestras de trabajo y contacto.',
    icono: '✦'
  },
  {
    id: 'twitter',
    nombre: 'X / Twitter',
    url: 'https://x.com/tu-usuario', // TODO
    desc: 'Microblog y actualizaciones.',
    icono: 'X'
  },
  {
    id: 'correo',
    nombre: 'Correo',
    url: 'mailto:tunombre@correo.com', // TODO
    desc: 'Escríbeme directamente.',
    icono: '✉'
  }
];

/* Utilidades */
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const desktop = $('#desktop');
const taskItems = $('#task-items');
const clockEl = $('#clock');
const startBtn = $('#start');
const startMenu = $('#start-menu');

let zTop = 10;

/* Reloj (Europa/Madrid) */
function updateClock() {
  const now = new Date();
  const opts = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
  clockEl.textContent = now.toLocaleTimeString('es-ES', opts);
}
setInterval(updateClock, 1000);
updateClock();

/* Iconos de escritorio */
function createDesktopIcons(){
  const tpl = $('#icon-template');
  const margin = 18, colX = 22, rowY = 24;
  let x = colX, y = rowY;

  APPS.forEach((app, i) => {
    const node = tpl.content.firstElementChild.cloneNode(true);
    node.dataset.app = app.id;
    node.style.left = x + 'px';
    node.style.top  = y + 'px';
    node.querySelector('.icon-label').textContent = app.nombre;

    const svg = node.querySelector('.icon-svg');
    svg.innerHTML = `
      <div style="position:absolute; inset:0; display:grid; place-items:center; font: 700 28px 'IBM Plex Mono', monospace; color:#042a3b; text-shadow: 0 1px 0 #fff;">
        ${app.icono}
      </div>
    `;

    // Drag & open
    enableDrag(node, { constrainToDesktop: true, saveKey: `icon:${app.id}` });
    node.addEventListener('dblclick', () => openAppWindow(app));
    node.addEventListener('keydown', (e) => { if(e.key === 'Enter') openAppWindow(app); });

    desktop.appendChild(node);

    // Layout en columnas
    y += 110;
    if (y > window.innerHeight - 180) { y = rowY; x += 110; }
  });

  // Restaurar posiciones guardadas
  $$('.desktop-icon').forEach(icon => {
    const k = `icon:${icon.dataset.app}`;
    const saved = localStorage.getItem(k);
    if(saved){
      const {left, top} = JSON.parse(saved);
      icon.style.left = left; icon.style.top = top;
    }
  });
}

/* Ventanas */
function openAppWindow(app){
  // Si ya hay una ventana de esta app, enfócala
  const existing = $(`.window[data-app="${app.id}"]`);
  if (existing) return focusWindow(existing);

  const tpl = $('#window-template');
  const win = tpl.content.firstElementChild.cloneNode(true);
  win.dataset.app = app.id;
  win.style.left = Math.max(24, Math.random()* (window.innerWidth - 560)) + 'px';
  win.style.top  = Math.max(24, 60 + Math.random()* (window.innerHeight - 360)) + 'px';
  focusWindow(win);

  // Título
  win.querySelector('.title-text').textContent = app.nombre;
  win.querySelector('.title-icon').textContent = app.icono;

  // Contenido
  const c = win.querySelector('.content');
  c.innerHTML = `
    <div class="app-title">${app.nombre}</div>
    <div class="app-desc">${app.desc}</div>
    <div class="app-actions">
      <a class="app-btn" href="${app.url}" target="_blank" rel="noreferrer">Abrir</a>
      <button class="app-btn secondary" data-copy="${app.url}">Copiar enlace</button>
    </div>
  `;

  c.addEventListener('click', async (e) => {
    const b = e.target.closest('[data-copy]');
    if(!b) return;
    const link = b.dataset.copy;
    try{
      await navigator.clipboard.writeText(link);
      toast('Enlace copiado al portapapeles');
    }catch{
      toast('No se pudo copiar');
    }
  });

  // Controles
  win.querySelector('.btn-close').addEventListener('click', () => closeWindow(win));
  win.querySelector('.btn-min').addEventListener('click', () => minimizeWindow(win));

  // Drag de ventana
  enableDrag(win.querySelector('.titlebar'), {
    onMove: (dx, dy, el) => {
      const w = el.parentElement;
      const rect = w.getBoundingClientRect();
      w.style.left = rect.left + dx + 'px';
      w.style.top  = rect.top + dy + 'px';
    },
    onStart: (el) => focusWindow(el.parentElement)
  });

  // Task button
  const taskBtn = document.createElement('button');
  taskBtn.className = 'task-btn';
  taskBtn.textContent = app.nombre;
  taskBtn.dataset.app = app.id;
  taskBtn.addEventListener('click', () => toggleMinimize(win, taskBtn));
  taskItems.appendChild(taskBtn);
  taskBtn.classList.add('active');

  desktop.appendChild(win);
}

function focusWindow(win){
  $$('.window').forEach(w => w.style.zIndex = '');
  win.style.zIndex = (++zTop).toString();
  $$('.task-btn').forEach(b => b.classList.toggle('active', b.dataset.app === win.dataset.app));
}

function closeWindow(win){
  const appId = win.dataset.app;
  win.remove();
  const btn = $(`.task-btn[data-app="${appId}"]`);
  if(btn) btn.remove();
}

function minimizeWindow(win){
  win.classList.add('hidden');
  const btn = $(`.task-btn[data-app="${win.dataset.app}"]`);
  if(btn) btn.classList.remove('active');
}

function toggleMinimize(win, btn){
  const hidden = win.classList.toggle('hidden');
  if(hidden){
    btn.classList.remove('active');
  }else{
    focusWindow(win);
    btn.classList.add('active');
  }
}

/* Drag utilitario */
function enableDrag(element, opts = {}) {
  let startX, startY, initX, initY, dragging = false;

  function onMouseDown(e) {
    const rect = element.getBoundingClientRect();
    startX = e.clientX;
    startY = e.clientY;
    initX = rect.left;
    initY = rect.top;
    dragging = true;
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    element.style.transition = 'none'; // sin suavizado mientras arrastra
  }

  function onMouseMove(e) {
    if (!dragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    let left = initX + dx;
    let top = initY + dy;

    if (opts.constrainToDesktop) {
      left = Math.max(8, Math.min(left, window.innerWidth - element.offsetWidth - 8));
      top = Math.max(8, Math.min(top, window.innerHeight - element.offsetHeight - 80));
    }

    element.style.left = left + 'px';
    element.style.top = top + 'px';
  }

  function onMouseUp() {
    if (!dragging) return;
    dragging = false;
    element.style.transition = 'left 0.1s ease, top 0.1s ease'; // efecto suave al soltar
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);

    if (opts.saveKey) {
      localStorage.setItem(
        opts.saveKey,
        JSON.stringify({ left: element.style.left, top: element.style.top })
      );
    }
  }

  element.addEventListener('mousedown', onMouseDown);
  element.addEventListener('touchstart', (e) => {
    // emulate mouse down for a single touch to support touch devices
    if (e.touches && e.touches[0]) {
      onMouseDown({
        clientX: e.touches[0].clientX,
        clientY: e.touches[0].clientY,
        preventDefault: () => {}
      });
      e.preventDefault?.();
    }
  }, {passive:true});
}

/* Menú Inicio */
startBtn.addEventListener('click', () => {
  startMenu.classList.toggle('open');
  startMenu.classList.toggle('hidden', false);
});
document.addEventListener('click', (e) => {
  if(!startMenu.contains(e.target) && e.target !== startBtn){
    startMenu.classList.remove('open');
  }
});
startMenu.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-action]');
  if(!btn) return;
  const action = btn.dataset.action;
  if(action === 'about'){
    modalInfo('Miku OS — iván’s Desktop', [
      'Tema: Windows Aero (cristal + blur)',
      'Iconos arrastrables con memoria de posición',
      'Ventanas con minimizar/cerrar',
      'Hecho para GitHub Pages'
    ]);
  }
  if(action === 'personalizar'){
    modalInfo('Personalizar', [
      'Cambia el fondo en style.css → #desktop (url)',
      'Edita colores en :root (paleta Aero)',
      'Añade/edita apps en script.js → APPS[]'
    ]);
  }
  if(action === 'reiniciar'){
    localStorage.clear();
    location.reload();
  }
});

/* Toast */
let toastTimeout = null;
function toast(msg){
  let el = $('#toast');
  if(!el){
    el = document.createElement('div');
    el.id = 'toast';
    el.style.position = 'fixed';
    el.style.left = '50%';
    el.style.bottom = '80px';
    el.style.transform = 'translateX(-50%)';
    el.style.padding = '10px 14px';
    el.style.borderRadius = '12px';
    el.style.zIndex = '9999';
    el.style.color = '#042a3b';
    el.style.background = 'linear-gradient(120deg,#a5f3fc,#c7d2fe)';
    el.style.boxShadow = '0 10px 24px rgba(2,6,23,.5)';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.style.opacity = '1';
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => el.style.opacity = '0', 1400);
}

/* Ventanas informativas rápidas */
function modalInfo(titulo, items){
  const app = { id: `info-${Date.now()}`, nombre: titulo, desc: '', url: '#' };
  openAppWindow(app);
  const w = $(`.window[data-app="${app.id}"]`);
  const c = w.querySelector('.content');
  c.innerHTML = `
    <div class="app-title">${titulo}</div>
    <ul style="margin:0; padding-left: 16px; color: var(--fg-dim); line-height:1.7;">
      ${items.map(x=>`<li>${x}</li>`).join('')}
    </ul>
  `;
  w.querySelector('.app-actions')?.remove();
}

/* Iniciar */
createDesktopIcons();

/* Accesibilidad: teclado para iconos */
document.addEventListener('keydown', (e) => {
  if(e.key === 'Escape'){
    // cierra el menú inicio y desenfoca
    startMenu.classList.remove('open');
    const topWin = $$('.window').sort((a,b) => (+b.style.zIndex||0)-(+a.style.zIndex||0))[0];
    if(topWin) focusWindow(topWin);
  }
});

/* Mejora de “cristal”: re-boost de blur al mover */
let boostTimeout = null;
['mousemove','touchmove'].forEach(ev => {
  document.addEventListener(ev, () => {
    document.documentElement.style.setProperty('--blur', '22px');
    clearTimeout(boostTimeout);
    boostTimeout = setTimeout(() => document.documentElement.style.setProperty('--blur', '18px'), 220);
  }, {passive:true});
});

/* === Reproductor de música Aero === */
const player = {
  audio: document.getElementById('mp-audio'),
  playBtn: document.getElementById('mp-play'),
  progress: document.getElementById('mp-progress'),
  volume: document.getElementById('mp-volume'),
  title: document.getElementById('mp-title'),
};

// Canciones (añade o cambia rutas)
const playlist = [
  { title: "windows breakcore - proloxx", src: "assets/windows_breakcore.mp3" },
  // { title: "Otra canción", src: "assets/otra.mp3" },
];
let current = 0;

// Cargar primera canción
function loadSong(i){
  const s = playlist[i];
  player.audio.src = s.src;
  player.title.textContent = s.title;
  player.progress.value = 0;
}
loadSong(current);

// Controles
player.playBtn.addEventListener('click', () => {
  if(player.audio.paused){
    player.audio.play();
    player.playBtn.textContent = '⏸';
  }else{
    player.audio.pause();
    player.playBtn.textContent = '▶';
  }
});

player.audio.addEventListener('timeupdate', () => {
  if(!player.progress.getAttribute('max')){
    player.progress.max = player.audio.duration;
  }
  player.progress.value = player.audio.currentTime;
});

player.progress.addEventListener('input', () => {
  player.audio.currentTime = player.progress.value;
});

player.volume.addEventListener('input', () => {
  player.audio.volume = player.volume.value;
});

player.audio.addEventListener('ended', () => {
  current = (current + 1) % playlist.length;
  loadSong(current);
  player.audio.play();
});