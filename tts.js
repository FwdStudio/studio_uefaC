(function(){
if(!("speechSynthesis" in window))return;
var ss=speechSynthesis,items=[],idx=0,on=false,tok=0,wl=null,voice=null,rate=parseFloat(localStorage.getItem("tts_rate")||"1");
function vs(){var v=ss.getVoices().filter(function(x){return /^it/i.test(x.lang)});voice=v[0]||null}
vs();ss.onvoiceschanged=vs;
var css=document.createElement("style");
css.textContent="#tb{position:fixed;left:0;right:0;bottom:0;z-index:99;display:flex;gap:6px;align-items:center;justify-content:center;padding:8px 10px calc(8px + env(safe-area-inset-bottom,0px));background:rgba(20,24,30,.94);color:#fff;font:15px -apple-system,system-ui,sans-serif}#tb button,#tb a,#tb select{border:0;border-radius:10px;padding:10px 12px;font:inherit;background:#2f3a48;color:#fff;text-decoration:none}#tb .p{background:#1f6feb;font-weight:600}#tb span{font-size:.8rem;opacity:.8}body{padding-bottom:84px}";
document.head.appendChild(css);
var b=document.createElement("div");b.id="tb";
b.innerHTML='<a href="index.html" title="Indice">⌂</a><button class="p" id="t1">🔊 Ascolta</button><button id="t2">Tutto il modulo</button><button id="t3">■</button><select id="t4"><option value="0.85">0,85×</option><option value="1">1×</option><option value="1.15">1,15×</option><option value="1.3">1,3×</option></select><span id="t5"></span>';
document.body.appendChild(b);
var $=function(i){return document.getElementById(i)};$("t4").value=String(rate);
function norm(t){return t.replace(/%/g," per cento").replace(/×/g," per ").replace(/→/g,", poi ").replace(/≥/g," almeno ").replace(/≤/g," al massimo ").replace(/≈/g," circa ").replace(/°/g," gradi").replace(/&/g," e ").replace(/\s+/g," ").trim()}
function tx(el){var c=el.cloneNode(true);[].forEach.call(c.querySelectorAll("br"),function(x){x.replaceWith(" . ")});[].forEach.call(c.querySelectorAll(".n"),function(x){x.remove()});return c.textContent}
var SEL="summary,h4,p,li,tr,.chip,.tip,.flow>div,.tl>div,.bar,.skills>div,.map a,.fc button";
function collect(secs){var out=[];secs.forEach(function(s){[].forEach.call(s.querySelectorAll(SEL),function(el){var t;if(el.tagName==="TR")t=[].map.call(el.children,function(c){return tx(c)}).join(": ");else if(el.matches(".fc button")){var sm=el.querySelector("small"),st=el.querySelector("strong");t=tx(sm)+". Risposta: "+tx(st)}else t=tx(el);t=norm(t);if(t)out.push(t)})});
var r=[];out.forEach(function(t){(t.match(/[^.;:!?]+[.;:!?]?/g)||[t]).forEach(function(p){p=p.trim();if(!p)return;if(r.length&&(r[r.length-1].length+p.length)<150)r[r.length-1]+=" "+p;else r.push(p)})});return r}
function say(){if(!on)return;if(idx>=items.length){stop();return}var my=++tok,u=new SpeechSynthesisUtterance(items[idx]);u.lang="it-IT";if(voice)u.voice=voice;u.rate=rate;u.onend=function(){if(my===tok){idx++;say()}};u.onerror=function(){if(my===tok){idx++;say()}};ss.speak(u);$("t5").textContent=Math.round(idx/items.length*100)+"%"}
function lock(){try{if(navigator.wakeLock)navigator.wakeLock.request("screen").then(function(l){wl=l}).catch(function(){})}catch(e){}}
function start(secs){ss.cancel();tok++;items=collect(secs);idx=0;on=true;lock();$("t1").textContent="⏸ Pausa";say()}
function pause(){on=false;tok++;ss.cancel();$("t1").textContent="▶ Riprendi"}
function stop(){on=false;tok++;ss.cancel();idx=0;items=[];$("t1").textContent="🔊 Ascolta";$("t5").textContent="";if(wl){try{wl.release()}catch(e){}wl=null}}
function cur(){var s=document.querySelector("section.on");return s?[s]:[].slice.call(document.querySelectorAll("section"))}
$("t1").onclick=function(){if(on)pause();else if(items.length&&idx<items.length){on=true;lock();$("t1").textContent="⏸ Pausa";say()}else start(cur())};
$("t2").onclick=function(){start([].filter.call(document.querySelectorAll("section"),function(s){return s.id!=="mappa"&&s.id!=="num"}))};
$("t3").onclick=stop;
$("t4").onchange=function(){rate=parseFloat(this.value);try{localStorage.setItem("tts_rate",this.value)}catch(e){}if(on){tok++;ss.cancel();say()}};
window.addEventListener("hashchange",function(){if(on||items.length)stop()});
document.addEventListener("visibilitychange",function(){if(!document.hidden&&on)lock()});
})();
