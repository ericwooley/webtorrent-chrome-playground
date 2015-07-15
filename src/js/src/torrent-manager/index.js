import dragDrop from 'drag-drop';
import WebTorrent from 'webtorrent';

const client = new WebTorrent();
dragDrop('#dragdrop', (files) => {
  console.log('Here are the dropped files', files);
  client.add(files, () => {
    console.log('added files')
  });
  files.forEach((file) => {
    console.log(file.name);
    console.log(file.size);
    console.log(file.type);
    console.log(file.lastModifiedData);

    const reader = new FileReader();
    reader.addEventListener('load', (e) => {
      const arr = new Uint8Array(e.target.result);
      const buffer = new Buffer(arr);
    });
    reader.addEventListener('error', (err) => {
      console.error('FileReader error' + err);
    });
    reader.readAsArrayBuffer(file);
  });
});
