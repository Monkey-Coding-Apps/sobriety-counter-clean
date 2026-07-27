//Service Worker
// This tells Android the service worker is active and listening
self.addEventListener('fetch', (event) => {
    // The app will fetch assets normally from the web
    event.respondWith(fetch(event.request));
});
