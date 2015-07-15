/* globals chrome */
import dragDrop from 'drag-drop/buffer';

function main(bg) {
  // const client = bg;
  let lastTorrent;
  dragDrop('#dragdrop', (files) => {
    console.log('adding files - test', files);
    bg.client.seed(files, (torrent) => {
      lastTorrent = torrent;
      console.log('added files', torrent.files[0], torrent.infoHash);
    });
  });
  const $$ = {
    saveButton: document.querySelector('.save-button')
  };
  $$.saveButton.addEventListener('click', () => {
    chrome.fileSystem.chooseFile({type: 'saveFile'}, (entry) => {
      debugger;
    });
  });
}
chrome.runtime.getBackgroundPage(main);
