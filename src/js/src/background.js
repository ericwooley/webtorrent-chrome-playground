/* globals chrome */
import WebTorrent from 'webtorrent';
window.client = new WebTorrent();

chrome.app.runtime.onLaunched.addListener(() => {
  chrome.app.window.create('index.html', {
    bounds: {
      width: 1000,
      height: 800
    }
  });
});
