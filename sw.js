const V='mk-alpha-1';
const SHELL=['./','./index.html','./game.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./icons/apple-touch-icon.png','./icons/favicon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
 const r=e.request;if(r.method!=='GET')return;
 const u=new URL(r.url);
 if(u.origin===location.origin){
  // pages: network first (so updates arrive), fall back to the cache when offline
  if(r.mode==='navigate'){e.respondWith(fetch(r).then(x=>{const c=x.clone();caches.open(V).then(k=>k.put(r,c));return x}).catch(()=>caches.match(r).then(m=>m||caches.match('./game.html'))));return}
  e.respondWith(caches.match(r).then(m=>m||fetch(r).then(x=>{const c=x.clone();caches.open(V).then(k=>k.put(r,c));return x})));return}
 // Google Fonts: keep a copy so the game still looks right offline
 if(u.host==='fonts.googleapis.com'||u.host==='fonts.gstatic.com'){
  e.respondWith(caches.open(V).then(c=>c.match(r).then(m=>{const f=fetch(r).then(x=>{c.put(r,x.clone());return x}).catch(()=>m);return m||f})))}
});
