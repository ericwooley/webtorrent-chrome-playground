/* globals chrome */
import dragDrop from 'drag-drop/buffer';

const $$ = {
  saveButton: document.querySelector('.save-button')
};

function writeFile(torrentFile, fileWriter, index = 0) {
  fileWriter.onwriteend = () => {
    console.log('Write completed.');
  };
  fileWriter.onerror = (e) => {
    console.log('Write failed: ' + e.toString());
  };
  fileWriter.onprogress = (event) => {
    const loadPercent = event.loaded / event.total * 100.0;
    console.log('progress', loadPercent);
  };

  const buffer = torrentFile.getBuffer((err, buffer) => {
    if(err) {
      throw err;
    }
    console.log('writing buffer', torrentFile, buffer);
    // const blob = new Blob(buffer, {type: torrentFile.type});
    const blob = new Blob(buffer.toArrayBuffer(), {type: 'image/png'} );
    fileWriter.write(blob);
    console.log('wrote to disk');
  });


  // writeFile(torrentFile, fileWriter, index + 1);
}
function saveTorrentFile(file) {
  return () => {
    chrome.fileSystem.chooseEntry({type: 'saveFile'}, (fileEntry) => {
      fileEntry.createWriter((fileWriter) => writeFile(file, fileWriter, 0));
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
