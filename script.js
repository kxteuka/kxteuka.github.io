const clock = document.getElementById("clock")
const tray = document.querySelector(".tray")

function updateClock() {
  const n = new Date()
  const options = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }
  const fecha = n.toLocaleDateString('es-ES', options).replace('.', '')
  const hora = n.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  clock.textContent = `${fecha} ${hora}`
}
setInterval(updateClock, 1000)
updateClock()


const player={audio:document.getElementById('mp-audio'),playBtn:document.getElementById('mp-play'),progress:document.getElementById('mp-progress'),volume:document.getElementById('mp-volume'),title:document.getElementById('mp-title')}
const playlist=[{title:"windows breakcore – proløxx",src:"assets/windows_breakcore.mp3"}]
let current=0

const npWrap=document.getElementById("now-playing")
const npText=document.getElementById("now-playing-text")

function showNowPlaying(text) {
  npText.classList.remove('scroll', 'show')
  npText.textContent = `Now playing: ${text}`
  npWrap.classList.remove('hidden')

  // Espera breve antes de mostrar el texto para suavizar
  setTimeout(() => {
    npText.classList.add('show')
    setTimeout(() => npText.classList.add('scroll'), 1000)
  }, 100)
}

function hideNowPlaying(){npWrap.classList.add('hidden');npText.classList.remove('scroll');npText.textContent=""}

function loadSong(i){const s=playlist[i];player.audio.src=s.src;player.audio.load();player.audio.loop=true;player.title.textContent=s.title||"Sin música";hideNowPlaying();player.progress.value=0}
loadSong(current)

player.playBtn.addEventListener("click",()=>{
  if(!player.audio.src)return
  if(player.audio.paused){
    player.audio.play().then(()=>{player.playBtn.textContent="⏸";showNowPlaying(playlist[current].title)}).catch(()=>{})
  }else{
    player.audio.pause();player.playBtn.textContent="▶";hideNowPlaying()
  }
})

player.audio.addEventListener("timeupdate",()=>{if(player.audio.duration){player.progress.max=player.audio.duration;player.progress.value=player.audio.currentTime}})
player.progress.addEventListener("input",()=>{player.audio.currentTime=player.progress.value})
player.volume.addEventListener("input",()=>{player.audio.volume=player.volume.value})

const desktop=document.getElementById('desktop')
const apps=[
  {label:'X (Twitter)',icon:'(๑•‿•๑)✧',url:'https://x.com/ichbinivann'},
  {label:'Tidal',icon:'(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧',url:'https://tidal.com/@ivantibiotico'},
  {label:'YouTube Music',icon:'(≧▽≦)',url:'https://music.youtube.com/channel/UCscAeuvYUeEZ_6-eULr28vA'},
  {label:'Notas',icon:'( •⌄• )✧',url:null}
]
function createIcons(){let x=20,y=24;apps.forEach(a=>{const b=document.createElement('button');b.className='desktop-icon';b.style.left=`${x}px`;b.style.top=`${y}px`;b.innerHTML=`<div class="icon-svg"><span>${a.icon}</span></div><span class="icon-label">${a.label}</span>`;if(a.url)b.onclick=()=>window.open(a.url,'_blank');else b.onclick=()=>openBlog();desktop.appendChild(b);y+=110;if(y>window.innerHeight-180){y=24;x+=110}})}
createIcons()

function openBlog() {
  const old = document.getElementById('blog-window')
  if (old) old.remove()

  const w = document.createElement('div')
  w.id = 'blog-window'
  w.className = 'glass'
  w.style.position = 'absolute'
  w.style.left = '50%'
  w.style.top = '120px'
  w.style.transform = 'translateX(-50%)'
  w.style.width = '700px'
  w.style.minHeight = '460px'
  w.style.borderRadius = '16px'
  w.style.overflow = 'hidden'

  w.innerHTML = `
    <div style="padding:10px;border-bottom:1px solid rgba(255,255,255,0.2);
    font-weight:600;display:flex;justify-content:space-between;align-items:center;">
      ( ˘ ³˘)ノ  Notas
      <button id="close-blog" style="border:0;background:transparent;color:var(--fg);
      cursor:pointer;font-size:18px;line-height:1;">×</button>
    </div>
    <div style="display:grid;grid-template-columns:220px 1fr;max-height:400px;overflow:hidden;">
      <div id="notes-list" style="padding:10px;overflow-y:auto;border-right:1px solid rgba(255,255,255,0.15);"></div>
      <div id="blog-content" style="padding:12px;overflow-y:auto;line-height:1.6;color:var(--fg-dim);
      font-family:'IBM Plex Mono',monospace;">Cargando notas...</div>
    </div>
  `
  document.body.appendChild(w)

  document.getElementById('close-blog').onclick = () => w.remove()

  fetch('assets/notas/index.json')
    .then(r => r.json())
    .then(list => {
      const menu = document.getElementById('notes-list')
      menu.innerHTML = list.map(n => 
        `<button class="note-btn" data-file="${n.file}" style="
          display:block;width:100%;text-align:left;margin-bottom:6px;
          background:linear-gradient(120deg,rgba(255,255,255,.2),rgba(255,255,255,.1));
          border:0;border-radius:8px;padding:8px;color:var(--fg);
          font-family:'IBM Plex Mono',monospace;cursor:pointer;
          transition:.2s ease;">${n.title}</button>`
      ).join('')

      const loadNote = (file) => {
        fetch('assets/notas/' + file)
          .then(r => r.text())
          .then(html => {
            document.getElementById('blog-content').innerHTML = html
          })
          .catch(() => {
            document.getElementById('blog-content').innerHTML =
              '<p style="color:#f66;">No se pudo cargar la nota (＞﹏＜)</p>'
          })
      }

      // evento al hacer clic
      menu.querySelectorAll('.note-btn').forEach(btn => {
        btn.addEventListener('click', () => loadNote(btn.dataset.file))
      })

      // Cargar la primera nota por defecto
      if (list.length > 0) loadNote(list[0].file)
    })
    .catch(() => {
      document.getElementById('blog-content').innerHTML =
        '<p style="color:#f66;">No se pudieron cargar las notas (＞﹏＜)</p>'
    })
}

const startBtn = document.getElementById('start')
const startMenu = document.getElementById('start-menu')

function toggleStart() {
  const isOpen = startMenu.classList.contains('open')
  startMenu.classList.toggle('open', !isOpen)
}

startBtn.addEventListener('click', e => {
  e.stopPropagation()
  toggleStart()
})

document.addEventListener('click', e => {
  if (!startMenu.contains(e.target) && !startBtn.contains(e.target)) {
    startMenu.classList.remove('open')
  }
})

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    startMenu.classList.remove('open')
  }
})

const splash=document.getElementById('splash')
setTimeout(()=>{splash.classList.add('hide');setTimeout(()=>{splash.style.display='none'},650)},3500)

const startRight = document.getElementById('start-right')

// Limpia el contenedor antes de crear los botones
startRight.innerHTML = ''

apps.forEach(app => {
  const btn = document.createElement('button')
  btn.className = 'start-action'
  btn.textContent = app.label.split(' ')[0] // usa el nombre principal (X, Tidal, etc.)

  if (app.url) {
    btn.addEventListener('click', () => {
      window.open(app.url, '_blank')
      startMenu.classList.remove('open')
    })
  } else {
    btn.addEventListener('click', () => {
      openBlog()
      startMenu.classList.remove('open')
    })
  }

  startRight.appendChild(btn)
})
