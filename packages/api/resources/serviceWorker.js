const CACHE_NAME = ''

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll([
      '/',
      '/manifest.json',
      '/main.js',
      '/1.main.js',
    ]))
  )
})

self.addEventListener('activate', event => {
  //
})

self.addEventListener('fetch', event => {
})
