const clock=document.getElementById("clock")
function updateClock(){const n=new Date();clock.textContent=n.toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit',second:'2-digit'})}
setInterval(updateClock,1000);updateClock()

const player={audio:document.getElementById('mp-audio'),playBtn:document.getElementById('mp-play'),progress:document.getElementById('mp-progress'),volume:document.getElementById('mp-volume'),title:document.getElementById('mp-title')}
const playlist=[{title:"windows breakcore – proløxx",src:"assets/windows_breakcore.mp3"}]
let current=0
const npWrap=document.getElementById("now-playing")
const npText=document.getElementById("now-playing-text")

function showNowPlaying(text){npText.classList.remove('scroll');npText.textContent=`Now playing: ${text}`;npWrap.classList.remove('hidden');setTimeout(()=>npText.classList.add('scroll'),800)}
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
  {label:'X (Twitter)',icon:'(๑•‿•๑)✧',url:'https://x.com/'},
  {label:'Tidal',icon:'(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧',url:'https://listen.tidal.com/'},
  {label:'YouTube Music',icon:'(≧▽≦)',url:'https://music.youtube.com/'},
  {label:'Blog',icon:'(づ｡◕‿‿◕｡)づ',url:null}
]
function createIcons(){let x=20,y=24;apps.forEach(a=>{const b=document.createElement('button');b.className='desktop-icon';b.style.left=`${x}px`;b.style.top=`${y}px`;b.innerHTML=`<div class="icon-svg"><span>${a.icon}</span></div><span class="icon-label">${a.label}</span>`;if(a.url)b.onclick=()=>window.open(a.url,'_blank');else b.onclick=()=>openBlog();desktop.appendChild(b);y+=110;if(y>window.innerHeight-180){y=24;x+=110}})}
createIcons()

function openBlog(){const o=document.getElementById('blog-window');if(o)o.remove();const w=document.createElement('div');w.id='blog-window';w.className='glass';w.style.position='absolute';w.style.left='120px';w.style.top='120px';w.style.width='600px';w.style.minHeight='400px';w.style.borderRadius='16px';w.style.overflow='hidden';w.innerHTML='<div style="padding:10px;border-bottom:1px solid rgba(255,255,255,0.2);font-weight:600;display:flex;justify-content:space-between;align-items:center;">( ˘ ³˘)ノ  Blog de Iván<button id="close-blog" style="border:0;background:transparent;color:var(--fg);cursor:pointer;font-size:18px;line-height:1;">×</button></div><div id="blog-content" style="padding:12px;line-height:1.6;color:var(--fg-dim);font-family:IBM Plex Mono,monospace;max-height:320px;overflow-y:auto;"><p>Bienvenido a mi espacio de notas (✿◠‿◠)</p><p>Aquí escribiré ideas rápidas, enlaces y posts cortos.</p></div>';document.body.appendChild(w);document.getElementById('close-blog').onclick=()=>w.remove()}

const startBtn=document.getElementById('start')
const startMenu=document.getElementById('start-menu')
const startList=document.getElementById('start-list')
startList.innerHTML=''
apps.forEach((a,i)=>{const e=document.createElement('button');e.className='start-item';e.textContent=a.label.split(' ')[0];e.onclick=a.url?()=>window.open(a.url,'_blank'):openBlog;startList.appendChild(e);setTimeout(()=>e.style.opacity=1,60*i)})
function toggleStart(){const open=startMenu.classList.contains('open');startMenu.classList.toggle('open',!open)}
startBtn.addEventListener('click',e=>{e.stopPropagation();toggleStart()})
document.addEventListener('click',e=>{if(!startMenu.contains(e.target)&&!startBtn.contains(e.target))startMenu.classList.remove('open')})
document.addEventListener('keydown',e=>{if(e.key==='Escape')startMenu.classList.remove('open')})

const splash=document.getElementById('splash')
setTimeout(()=>{splash.classList.add('hide');setTimeout(()=>{splash.style.display='none'},650)},3500)

const mascot=document.getElementById('mascot')
let tx=window.innerWidth/2,ty=window.innerHeight-110,cx=tx,cy=ty
function onPoint(x,y){tx=x;ty=Math.min(Math.max(y,100),window.innerHeight-110)}
window.addEventListener('mousemove',e=>onPoint(e.clientX,e.clientY))
window.addEventListener('touchmove',e=>{const t=e.touches[0];onPoint(t.clientX,t.clientY)})
function loop(){cx+= (tx-cx)*0.1; cy+= (ty-cy)*0.1; mascot.style.transform=`translate(-50%,0) translate(${cx - window.innerWidth/2}px, ${cy-(window.innerHeight-64)}px)`; requestAnimationFrame(loop)}
loop()
