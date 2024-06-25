// service-worker.js
self.addEventListener('install', event => {
	event.waitUntil(
	  caches.open('podcast-cache').then(cache => {
		return cache.addAll([
		  '/pwapods/',
		  '/pwapods/index.html',
		  '/pwapods/styles.css',
		  '/pwapods/app.js',
		  // 必要な他のファイル
		]);
	  })
	);
  });
  
  self.addEventListener('fetch', event => {
	event.respondWith(
	  caches.match(event.request).then(response => {
		return response || fetch(event.request);
	  })
	);
  });
