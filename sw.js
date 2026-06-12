const CACHE_NAME = 'tanjim-store-v2';

// এখানে আপনার ওয়েবসাইটের জরুরি ফাইলগুলোর নাম দেওয়া হলো
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './data.json'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // যদি কোনো ফাইল খুঁজে না পায়, তবুও যেন ক্র্যাশ না করে সেই ব্যবস্থা
      return Promise.all(
        ASSETS_TO_CACHE.map(url => {
          return cache.add(url).catch(err => console.log('এই ফাইলটি ক্যাশ করা যায়নি:', url));
        })
      );
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // অফলাইনে থাকলে ক্যাশ থেকে দেখাবে, অনলাইনে থাকলে ইন্টারনেট থেকে আনবে
      return response || fetch(event.request).catch(() => {
        console.log('অফলাইন মোড অ্যাক্টিভ');
      });
    })
  );
});
