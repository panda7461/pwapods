// service-worker.js
self.addEventListener('install', event => {
	event.waitUntil(
	  caches.open('podcast-cache').then(cache => {
		return cache.addAll([
		  './',
		  './index.html',
		  './styles.css',
		  './app.js',
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
  async function fetchPodcastFeed(url) {
	const response = await fetch(url);
	const text = await response.text();
	const parser = new DOMParser();
	const xml = parser.parseFromString(text, 'application/xml');
	return Array.from(xml.querySelectorAll('item')).map(item => ({
	  title: item.querySelector('title').textContent,
	  enclosure: item.querySelector('enclosure').getAttribute('url')
	}));
  }
  
  document.addEventListener('DOMContentLoaded', async () => {
	const podcastList = document.getElementById('podcast-list');
	const podcasts = await fetchPodcastFeed('RSS_FEED_URL');
	podcasts.forEach(podcast => {
	  const listItem = document.createElement('li');
	  listItem.textContent = podcast.title;
	  listItem.addEventListener('click', () => playPodcast(podcast.enclosure));
	  podcastList.appendChild(listItem);
	});
  });
  
  function playPodcast(url) {
	const audioPlayer = document.getElementById('audio-player');
	audioPlayer.src = url;
	audioPlayer.play();
  }
  function downloadPodcast(url, title) {
	fetch(url)
	  .then(response => response.blob())
	  .then(blob => {
		const blobUrl = window.URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.style.display = 'none';
		a.href = blobUrl;
		a.download = `${title}.mp3`;
		document.body.appendChild(a);
		a.click();
		window.URL.revokeObjectURL(blobUrl);
	  })
	  .catch(error => console.error('Download failed:', error));
  }
  
  document.addEventListener('DOMContentLoaded', async () => {
	const podcastList = document.getElementById('podcast-list');
	const podcasts = await fetchPodcastFeed('RSS_FEED_URL');
	podcasts.forEach(podcast => {
	  const listItem = document.createElement('li');
	  listItem.textContent = podcast.title;
  
	  const downloadButton = document.createElement('button');
	  downloadButton.textContent = 'Download';
	  downloadButton.addEventListener('click', () => downloadPodcast(podcast.enclosure, podcast.title));
  
	  listItem.appendChild(downloadButton);
	  listItem.addEventListener('click', () => playPodcast(podcast.enclosure));
	  podcastList.appendChild(listItem);
	});
  });
  