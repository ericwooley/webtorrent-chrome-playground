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
    /*
    const blob = new Blob([buffer], {type: mimeType(torrentFile.name)} );
    fileWriter.write(blob);
    console.log('wrote file');
    /*/

    let chunkIndex = 0;
    const blobMeta = {type: mimeType(torrentFile.name)};
    function writeChunk(chunk, preventSeek = false) {
      const blob = {blob: new Blob([chunk], blobMeta)};
      if (!preventSeek) {
        fileWriter.seek(0);
      }
      setTimeout(() => {
        fileWriter.write(blob.blob);
        delete blob.blob;
      }, 20);
    }

    function getNextChunk() {
      const chunkStart = chunkIndex * chunkSize;
      if (chunkStart > buffer.length) {
        return null;
      }
      const chunkEnd = Math.min(((chunkIndex + 1) * chunkSize), buffer.length);
      console.log('chuck:', chunkStart, chunkEnd, '/', buffer.length);
      return buffer.slice(chunkStart, chunkEnd);
    }
    writeChunk(getNextChunk(), true);
    chunkIndex += 1;
    fileWriter.onwriteend = () => {
      // console.log('Write completed.');
      const nextChunk = getNextChunk();
      if (nextChunk) {
        writeChunk(nextChunk);
        chunkIndex += 1;
      } else {
        console.log('completed write');
      }
    };
    //*/
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
