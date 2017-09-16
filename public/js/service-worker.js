const PRECACHE = 'magellan-v2';

// list of local resources we always want to be cached
const PRECACHE_URLS = [
    '/dist/scripts/external.js',
    '/dist/scripts/script.js',
    '/dist/styles/styles.css'
];

// the install handler takes care of precaching the resources we always need
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(PRECACHE)
            .then(cache => cache.addAll(PRECACHE_URLS))
            .then(self.skipWaiting())
    );
});

// the activate handler takes care of cleaning up old caches
self.addEventListener('activate', event => {
    const currentCaches = [PRECACHE];

    event.waitUntil(
        caches.keys().then(cacheNames => {
            return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
        }).then(cachesToDelete => {
            return Promise.all(cachesToDelete.map(cacheToDelete => {
                return caches.delete(cacheToDelete);
            }));
        }).then(() => self.clients.claim())
    );
});

// the fetch handler serves responses for same-origin responses from a cache
self.addEventListener('fetch', event => {
    console.log('fetch', event.request);
    // skip cross-origin requests
    if (event.request.url.startsWith(self.location.origin)) {
        event.respondWith(
            caches.match(event.request)
                .then(cachedResponse => {
                    if (cachedResponse) {
                        console.log('serving from cache', event.request.url);
                        return cachedResponse;
                    }

                    return fetch(event.request);
                })
                .catch(err => {
                    console.error(err);
                })
        );
    }
});