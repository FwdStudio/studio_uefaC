(function(){
if(!("speechSynthesis" in window))return;
var ss=speechSynthesis,items=[],idx=0,on=false,tok=0,wl=null,voice=null,rate=parseFloat(localStorage.getItem("tts_rate")||"1");
function vs(){var v=ss.getVoices().filter(function(x){return /^it/i.test(x.lang)});voice=v[0]||null}
vs();ss.onvoiceschanged=vs;
var css=document.createElement("style");
css.textContent="#tb{position:fixed;left:0;right:0;bottom:0;z-index:99;display:flex;flex-wrap:wrap;gap:6px;align-items:center;justify-content:center;padding:8px 10px calc(8px + env(safe-area-inset-bottom,0px));background:rgba(20,24,30,.94);color:#fff;font:15px -apple-system,system-ui,sans-serif}#tb button,#tb a,#tb select{border:0;border-radius:10px;padding:8px 10px;font:inherit;background:#2f3a48;color:#fff;text-decoration:none}#tb .p{background:#1f6feb;font-weight:600}#tb span{font-size:.8rem;opacity:.8}body{padding-bottom:120px}";
document.head.appendChild(css);
var b=document.createElement("div");b.id="tb";
var f=location.pathname.split("/").pop()||"",x="",sl=f.replace(/^(mappa|testo|ripasso)-/,"").replace(".html",""),NOT=["calcio-paralimpico"],AUD=["carte-federali","regolamento-gioco","medicina-sport","tecnica-tattica","preparazione-fisica","portiere","futsal","calcio-femminile","calcio-paralimpico","aiac","safeguarding","psicologia-sport"],k=(f.match(/^(mappa|testo|ripasso)-/)||[])[1];
function L(p,i,t){return '<a href="'+p+'-'+sl+'.html" title="'+t+'">'+i+'</a>'}
if(k){if(k!=="mappa")x+=L("mappa","🗺","Mappa");if(k!=="testo"&&NOT.indexOf(sl)<0)x+=L("testo","📄","Testo completo");if(k!=="ripasso"&&AUD.indexOf(sl)>-1)x+=L("ripasso","🎧","Ripasso audio")}
b.innerHTML='<a href="index.html" title="Indice">⌂</a><a href="appunti.html" title="Il mio foglio">📒</a>'+x+'<button class="p" id="t1">🔊 Ascolta</button><button id="t2">Tutto il modulo</button><button id="t3">■</button><select id="t4"><option value="0.85">0,85×</option><option value="1">1×</option><option value="1.15">1,15×</option><option value="1.3">1,3×</option></select><span id="t5"></span>';
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

(function(){
var K="uc_notes",pg=(location.pathname.split("/").pop()||"index.html"),kind=/^testo-/.test(pg)?"Testo":/^ripasso-/.test(pg)?"Ripasso":/^mappa-/.test(pg)?"Mappa":"";
var T={"carte-federali":"1. Carte federali","regolamento-gioco":"2. Regolamento di gioco","medicina-sport":"3. Medicina dello sport","tecnica-tattica":"4. Tecnica e tattica","preparazione-fisica":"5. Preparazione fisico-atletica","portiere":"6. Il portiere e l’allenatore dei portieri","futsal":"7. Il futsal","calcio-femminile":"8. Il calcio femminile","aiac":"9. L’AIAC, la casa dei tecnici","safeguarding":"10. Safeguarding","psicologia-sport":"11. Psicologia dello sport e il coach","calcio-paralimpico":"12. Calcio paralimpico"};
var slug=pg.replace(/^(mappa|testo|ripasso)-/,"").replace(".html",""),tit=T[slug]||document.title.replace(/^(Testo completo|Ripasso audio|Mappa di studio)\s*[–-]\s*/,"");
function load(){try{return JSON.parse(localStorage.getItem(K))||[]}catch(e){return[]}}
function save(a){try{localStorage.setItem(K,JSON.stringify(a))}catch(e){}}
var css=document.createElement("style");css.textContent=".hl{background:#ffe066;color:#111;border-radius:3px;padding:0 1px}#hb{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(128px + env(safe-area-inset-bottom,0px));z-index:100;display:none;border:0;border-radius:999px;padding:11px 18px;font:600 15px -apple-system,system-ui,sans-serif;background:#f5b700;color:#111;box-shadow:0 2px 10px rgba(0,0,0,.35)}#ht{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(180px + env(safe-area-inset-bottom,0px));z-index:100;display:none;background:#222;color:#fff;border-radius:10px;padding:8px 12px;font:14px -apple-system,system-ui,sans-serif}";
document.head.appendChild(css);
var b=document.createElement("button");b.id="hb";b.textContent="★ Evidenzia e salva";document.body.appendChild(b);
var tt=document.createElement("div");tt.id="ht";document.body.appendChild(tt);
function toast(m){tt.textContent=m;tt.style.display="block";setTimeout(function(){tt.style.display="none"},1700)}
var cur=null;
function inBar(n){while(n){if(n.id==="tb"||n.id==="hb")return true;n=n.parentNode}return false}
document.addEventListener("selectionchange",function(){var s=window.getSelection();if(!s||s.isCollapsed||!s.rangeCount){if(!cur)b.style.display="none";return}var t=s.toString().replace(/\s+/g," ").trim(),r=s.getRangeAt(0);if(t.length<2||t.length>400||inBar(r.commonAncestorContainer)){b.style.display="none";return}cur={t:t,r:r.cloneRange()};b.style.display="block"});
function wrap(r){try{if(r.startContainer===r.endContainer&&r.startContainer.nodeType===3){var m=document.createElement("mark");m.className="hl";r.surroundContents(m);return true}}catch(e){}return false}
function add(){if(!cur)return;var a=load();if(!a.some(function(x){return x.t===cur.t&&x.p===pg})){a.push({t:cur.t,p:pg,m:tit,k:kind,d:Date.now()});save(a);toast("Salvato in: "+tit)}else toast("Già nel foglio");wrap(cur.r);var s=window.getSelection();if(s)s.removeAllRanges();b.style.display="none";cur=null}
b.addEventListener("mousedown",function(e){e.preventDefault()});
b.addEventListener("touchstart",function(e){e.preventDefault();add()},{passive:false});
b.addEventListener("click",add);
function nodes(){var w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null),ns=[],n;while(n=w.nextNode()){if(!inBar(n)&&n.parentNode&&!/^(SCRIPT|STYLE)$/.test(n.parentNode.nodeName)&&n.parentNode.nodeName!=="MARK")ns.push(n)}return ns}
function restore(){load().filter(function(x){return x.p===pg}).forEach(function(x){var ns=nodes();for(var i=0;i<ns.length;i++){var k=ns[i].nodeValue.indexOf(x.t);if(k>=0){try{var r=document.createRange();r.setStart(ns[i],k);r.setEnd(ns[i],k+x.t.length);var m=document.createElement("mark");m.className="hl";r.surroundContents(m)}catch(e){}break}}})}
restore();
})();
