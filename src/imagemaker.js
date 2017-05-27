const dataURLtoBlob = (dataURL, type) => {
  const binary = atob(dataURL.split(',')[1]);
  const length = binary.length;
  const binaryArray = new Uint8Array(length);

  for (let i = 0; i < length; i++) {
    binaryArray[i] = binary.charCodeAt(i);
  }

  return new Blob([binaryArray], {
    type: type
  });
}

export default class {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.anchor = document.createElement('a');
  }

  resize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  createImage(width, height) {
    this.resize(width, height);

    const imageType = 'image/png';
    const dataURL = this.canvas.toDataURL(imageType);

    if (this.blobURL) {
      URL.revokeObjectURL(this.blobURL);
    }

    const blob = dataURLtoBlob(dataURL, imageType);
    this.blobURL = URL.createObjectURL(blob);
  }

  download() {
    if (!this.blobURL) {
      this.createImage();
    }

    this.anchor.href = this.blobURL;
    this.anchor.download = 'solid_wallpaper.png';
    this.anchor.target = '_blank';

    const ev = document.createEvent('MouseEvents');
    ev.initMouseEvent(
      'click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, this.anchor
    );
    this.anchor.dispatchEvent(ev);
  }
}