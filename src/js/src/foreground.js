/* globals chrome */
import dragDrop from 'drag-drop/buffer';
import writeFile from './file-writer';

const $$ = {
  saveButton: document.querySelector('.save-button')
};
function saveTorrentFile(file) {
  return () => {
    chrome.fileSystem.chooseEntry({type: 'saveFile'}, (fileEntry) => {
      fileEntry.createWriter((fileWriter) => writeFile(file, fileWriter));
    });
  };
}
function main(bg) {
  dragDrop('#dragdrop', (files) => {
    console.log('adding files - test', files);
    bg.client.seed(files, (torrent) => {
      console.log('added files', torrent.files[0], torrent.infoHash);
      $$.saveButton.removeEventListener('click');
      $$.saveButton.addEventListener('click', saveTorrentFile(torrent.files[0]));
    });
  });
}
chrome.runtime.getBackgroundPage(main);
