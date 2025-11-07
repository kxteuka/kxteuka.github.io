/* === Reloj con segundos === */
const clockEl = document.getElementById("clock");
function updateClock(){
  const now = new Date();
  const opts = {hour:'2-digit',minute:'2-digit',second:'2-digit'};
  clockEl.textContent = now.toLocaleTimeString('es-ES', opts);
}
setInterval(updateClock,1000);updateClock();

/* === Reproductor === */
const player={
  audio:document.getElementById('mp-audio'),
  playBtn:document.getElementById('mp-play'),
  progress:document.getElementById('mp-progress'),
  volume:document.getElementById('mp-volume'),
  title:document.getElementById('mp-title'),
};
const playlist=[
  {title:"windows breakcore – proløxx",src:"assets/windows_breakcore.mp3"},
];
let current=0;
const nowPlayingText=document.getElementById("now-playing-text");
function updateNowPlaying(t){nowPlayingText.textContent=`Now playing: ${t}`;}
function loadSong(i){
  const s=playlist[i];
  player.audio.src=s.src;
  player.audio.load();
  player.audio.loop=true;
  player.title.textContent=s.title||"Sin título";
  updateNowPlaying(s.title||"Sin título");
  player.progress.value=0;
}
loadSong(current);

player.playBtn.addEventListener("click",()=>{
  if(!player.audio.src)return;
  if(player.audio.paused){
    player.audio.play().then(()=>{
      player.playBtn.textContent="⏸";
      updateNowPlaying(playlist[current].title);
    }).catch(err=>console.log("Interacción requerida:",err));
  }else{
    player.audio.pause();
    player.playBtn.textContent="▶";
  }
});
player.audio.addEventListener("timeupdate",()=>{
  if(player.audio.duration){
    player.progress.max=player.audio.duration;
    player.progress.value=player.audio.currentTime;
  }
});
player.progress.addEventListener("input",()=>{
  player.audio.currentTime=player.progress.value;
});
player.volume.addEventListener("input",()=>{
  player.audio.volume=player.volume.value;
});

/* === Iconos del escritorio === */
const desktop=document.getElementById('desktop');
const apps=[
  {id:'x',label:'X (Twitter)',icon:'(๑•‿•๑)✧',url:'https://x.com/'},
  {id:'tidal',label:'Tidal',icon:'(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧',url:'https://listen.tidal.com/'},
  {id:'ytmusic',label:'YouTube Music',icon:'(≧▽≦)',url:'https://music.youtube.com/'},
  {id:'blog',label:'Blog',icon:'(づ｡◕‿‿◕｡)づ',url:null},
];
function createIcons(){
  let x=20,y=24;
  apps.forEach(app=>{
    const btn=document.createElement('button');
    btn.className='desktop-icon';
    btn.style.left=`${x}px`;btn.style.top=`${y}px`;
    btn.innerHTML=`<div class="icon-svg">${app.icon}</div><span class="icon-label">${app.label}</span>`;
    if(app.url){
      btn.onclick=()=>window.open(app.url,'_blank');
    }else{
      btn.onclick=()=>openBlog();
    }
    desktop.appendChild(btn);
    y+=110;if(y>window.innerHeight-180){y=24;x+=110;}
  });
}
createIcons();

/* === Mini-blog interno === */
function openBlog(){
  const old=document.getElementById('blog-window');
  if(old){old.remove();}
  const win=document.createElement('div');
  win.id='blog-window';
  win.className='glass';
  win.style.position='absolute';
  win.style.left='120px';
  win.style.top='120px';
  win.style.width='420px';
  win.style.minHeight='260px';
  win.style.borderRadius='16px';
  win.style.overflow='hidden';
  win.innerHTML=`
    <div style="padding:10px;border-bottom:1px solid rgba(255,255,255,0.2);font-weight:600;">
      ( ˘ ³˘)ノ  Blog de Iván
      <button id="close-blog" style="float:right;border:0;background:transparent;color:var(--fg);cursor:pointer;">×</button>
    </div>
    <div id="blog-content" style="padding:12px;line-height:1.6;color:var(--fg-dim);font-family:'IBM Plex Mono',monospace;">
      <p>Bienvenido a mi pequeño espacio de notas (✿◠‿◠)  
      Aquí puedes escribir lo que quieras; este texto está dentro del HTML.</p>
    </div>`;
  document.body.appendChild(win);
  document.getElementById('close-blog').onclick=()=>win.remove();
}

/* === Botón Inicio === */
const startBtn=document.getElementById('start');
startBtn.addEventListener('click',()=>{
  openBlog();
});
