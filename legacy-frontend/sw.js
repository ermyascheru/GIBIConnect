const CACHE_NAME = 'gibiconnect-v1';
const ASSETS = [
  '/',
  '/explore.html',
  '/login.html',
  '/INSTITUTION_GLOBAL.html',
  '/INSTITUTION_PROFILE.html',
  '/Programs.html',
  '/Programs_profile.html',
  '/admissions.html',
  '/Admission_profile.html',
  '/Scholarships.html',
  '/scholarship_profile.html',
  '/Resources.html',
  '/ai-advisor.html',
  '/Profile.html',
  '/manifest.json',
  '/assets/gibi_logo-removebg-preview.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});