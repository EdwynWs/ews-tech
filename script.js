const menu=document.querySelector('.menu-toggle');
const nav=document.querySelector('#navigation');
function closeMenu(){menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Abrir menu');nav.classList.remove('open')}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');nav.classList.toggle('open',open)});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMenu();menu.focus()}});
document.addEventListener('click',e=>{if(!e.target.closest('.header'))closeMenu()});
document.querySelector('#year').textContent=new Date().getFullYear();
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
if('IntersectionObserver' in window){
 if(!reduced.matches){document.body.classList.add('js-motion');const reveals=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');reveals.unobserve(e.target)}}),{threshold:.08});document.querySelectorAll('.reveal').forEach(el=>reveals.observe(el))}
 const sections=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){nav.querySelectorAll('a').forEach(a=>a.classList.toggle('active',a.hash==='#'+e.target.id))}}),{rootMargin:'-15% 0px -60% 0px'});document.querySelectorAll('main>section[id]').forEach(s=>sections.observe(s));
}
const progress=document.querySelector('.reading-progress');
let ticking=false;window.addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(()=>{const max=document.documentElement.scrollHeight-innerHeight;progress.style.width=(max>0?scrollY/max*100:0)+'%';ticking=false});ticking=true}},{passive:true});
const hero=document.querySelector('.hero');const visual=document.querySelector('.hero-visual');
if(matchMedia('(pointer:fine)').matches&&!reduced.matches){hero.addEventListener('pointermove',e=>{const r=hero.getBoundingClientRect();visual.style.setProperty('--px',((e.clientX-r.left)/r.width-.5)*14+'px');visual.style.setProperty('--py',((e.clientY-r.top)/r.height-.5)*14+'px')});hero.addEventListener('pointerleave',()=>{visual.style.setProperty('--px','0px');visual.style.setProperty('--py','0px')})}
document.querySelectorAll('details').forEach(detail=>detail.addEventListener('toggle',()=>{if(detail.open)document.querySelectorAll('details').forEach(other=>{if(other!==detail)other.open=false})}));
