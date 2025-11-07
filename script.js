const clockEl = document.getElementById("clock");
function updateClock(){
  const now = new Date();
  const opts = {hour:'2-digit',minute:'2-digit',second:'2-digit'};
  clockEl.textContent = now.toLocaleTimeString('es-ES', opts);
}
setInterval(updateClock,1000);updateClock();

const player={
  audio:document.getElementById('mp-audio'),
  playBtn:document.getElementById('mp-play'),
  progress:document.getElementById('mp-progress'),
  volume:document.getElementById('mp-volume'),
  title:document.getElementById('mp-title'),
};
const playlist=[
  {title:"windows breakcore – proløxx",src:"assets/windows_breakcore.mp3"}
];
let current=0;
const nowPlayingText=document.getElementById("now-playing-text");
function updateNowPlaying(t){nowPlayingText.textContent=`Now playing: ${t}`;}
function loadSong(i){
  const s=playlist[i];
  player.audio.src=s.src;
  player.audio.load();
  player.audio.loop=true;
  player.title.textContent=s.title||"Sin música";
  updateNowPlaying(s.title||"Sin música");
  player.progress.value=0;
}
loadSong(current);
player.playBtn.addEventListener("click",()=>{
  if(!player.audio.src)return;
  if(player.audio.paused){
    player.audio.play().then(()=>{
      player.playBtn.textContent="⏸";
      updateNowPlaying(playlist[current].title);
    }).catch(()=>{});
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

const desktop=document.getElementById('desktop');
const apps=[
  {id:'x',label:'X (Twitter)',icon:'(๑•‿•๑)✧',url:'https://x.com/'},
  {id:'tidal',label:'Tidal',icon:'(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧',url:'https://listen.tidal.com/'},
  {id:'ytmusic',label:'YouTube Music',icon:'(≧▽≦)',url:'https://music.youtube.com/'},
  {id:'blog',label:'Blog',icon:'(づ｡◕‿‿◕｡)づ',url:null}
];
function createIcons(){
  let x=20,y=24;
  apps.forEach(app=>{
    const btn=document.createElement('button');
    btn.className='desktop-icon';
    btn.style.left=`${x}px`;btn.style.top=`${y}px`;
    btn.innerHTML=`<div class="icon-svg"><span>${app.icon}</span></div><span class="icon-label">${app.label}</span>`;
    if(app.url){btn.onclick=()=>window.open(app.url,'_blank');}
    else{btn.onclick=()=>openBlog();}
    desktop.appendChild(btn);
    y+=110;if(y>window.innerHeight-180){y=24;x+=110;}
  });
}
createIcons();

function openBlog(){
  const old=document.getElementById('blog-window');
  if(old){old.remove();}
  const win=document.createElement('div');
  win.id='blog-window';
  win.className='glass';
  win.style.position='absolute';
  win.style.left='120px';
  win.style.top='120px';
  win.style.width='600px';
  win.style.minHeight='400px';
  win.style.borderRadius='16px';
  win.style.overflow='hidden';
  win.innerHTML=
    '<div style="padding:10px;border-bottom:1px solid rgba(255,255,255,0.2);font-weight:600;display:flex;justify-content:space-between;align-items:center;">( ˘ ³˘)ノ  Blog de Iván<button id="close-blog" style="border:0;background:transparent;color:var(--fg);cursor:pointer;font-size:18px;line-height:1;">×</button></div>'+
    '<div id="blog-content" style="padding:12px;line-height:1.6;color:var(--fg-dim);font-family:IBM Plex Mono,monospace;max-height:320px;overflow-y:auto;">'+
    '<p>Bienvenido a mi espacio de notas (✿◠‿◠)</p>'+
    '<p>Aquí escribiré ideas rápidas, enlaces y posts cortos.</p>'+
    '</div>';
  document.body.appendChild(win);
  document.getElementById('close-blog').onclick=()=>win.remove();
}

const startMenu=document.getElementById('start-menu');
const startGrid=document.getElementById('start-apps');
const startBtn=document.getElementById('start');
startBtn.addEventListener('click',()=>{
  const isOpen=startMenu.classList.contains('open');
  startMenu.classList.toggle('open',!isOpen);
  if(!isOpen){
    startGrid.innerHTML='';
    apps.forEach((app,i)=>{
      const el=document.createElement('div');
      el.className='app';
      el.textContent=app.label.split(' ')[0];
      el.onclick=app.url?()=>window.open(app.url,'_blank'):openBlog;
      startGrid.appendChild(el);
      setTimeout(()=>el.classList.add('visible'),100*i);
    });
  }else{
    startGrid.innerHTML='';
  }
});
document.addEventListener('click',(e)=>{
  if(!startMenu.contains(e.target)&&e.target!==startBtn){startMenu.classList.remove('open');startGrid.innerHTML='';}
});
