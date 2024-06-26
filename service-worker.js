self.addEventListener('install', event => {
	event.waitUntil(
	  caches.open('podcast-cache').then(cache => {
		return cache.addAll([
		  '/',
		  '/index.html',
		  '/styles.css',
		  '/app.js',
		  // �K�v�ȑ��̃t�@�C��
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
  