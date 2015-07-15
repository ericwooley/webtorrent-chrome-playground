/* globals chrome */
import dragDrop from 'drag-drop/buffer';
import mimeType from './mime';


const chunkSize = 1024 * 1024 * 5; // 5 megabyte chunks
const $$ = {
  saveButton: document.querySelector('.save-button')
};

function writeFile(torrentFile, fileWriter) {

  fileWriter.onerror = (e) => {
    console.log('Write failed: ' + e);
  };

  torrentFile.getBuffer((err, buffer) => {
    if (err) {
      throw err;
    }
    const blob = new Blob([buffer], {type: mimeType(torrentFile.name)} );
    fileWriter.write(blob);
    console.log('wrote file');
    // function writeChunk(chunk) {
    //   const blob = new Blob([chunk], {type: mimeType(torrentFile.name)} );
    //   if (fileWriter.length > 0) {
    //     fileWriter.seek(fileWriter.length);
    //   }
    //   fileWriter.write(blob);
    //   console.log('wrote chunk');
    // }
    // let chunkIndex = 0;
    // function getNextChunk() {
    //   const chunkStart = chunkIndex * chunkSize;
    //   if (chunkStart > buffer.length) {
    //     return null;
    //   }
    //   const chunkEnd = Math.min((chunkIndex + 1) * chunkSize, buffer.length);
    //   const chunk = buffer.slice(chunkStart, chunkEnd);
    //   chunkIndex += 1;
    //   return chunk;
    // }
    // writeChunk(getNextChunk());
    // // fileWriter.onprogress = (event) => {
    // //   const loadPercent = event.loaded / event.total * 100.0;
    // //   console.log('progress', loadPercent);
    // //   if (loadPercent === 100) {
    // //
    // //   }
    // // };
    // fileWriter.onwriteend = () => {
    //   console.log('Write completed.');
    //   const nextChunk = getNextChunk();
    //   if (nextChunk) {
    //     console.log('writing next chunk');
    //     setTimeout(() => writeChunk(nextChunk), 10);
    //   }
    // };
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
