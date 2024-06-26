const PROXY_URL = 'http://localhost:3000/proxy?url='; // プロキシサーバーのURL
const RSS_FEED_URL = 'https://www.nhk.or.jp/s-media/news/podcast/list/v1/all.xml'; // 実際のRSSフィードのURL

async function fetchPodcastFeed(url) {
  const response = await fetch(PROXY_URL + encodeURIComponent(url));
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
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
  try {
    const podcasts = await fetchPodcastFeed(RSS_FEED_URL);
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
  } catch (error) {
    console.error('Failed to fetch podcast feed:', error);
  }
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
