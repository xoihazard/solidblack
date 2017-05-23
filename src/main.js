import SVG from 'svg.js'

let screenWidth, screenHeight;

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

class ImageMaker {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.anchor = document.createElement('a');
  }

  resize() {
    this.canvas.width = screenWidth;
    this.canvas.height = screenHeight;
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  createImage() {
    this.resize();

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

class Wireframe {
  constructor(container) {

    this.fgColor = '#ddd';
    this.svg = SVG(container);
    this.rect = this.svg.rect();

    this.text = {
      width: this.svg.text('Width'),
      height: this.svg.text('Height')
    }

    this.path = {
      width: this.svg.path(),
      height: this.svg.path()
    }

    this.rect.attr({
      fill: 'transparent',
      stroke: this.fgColor,
      'stroke-width': 1
    });

    for (const key in this.text) {
      this.text[key].attr({
        fill: this.fgColor
      });

      this.text[key].font({
        family: 'Menlo',
        size: 11
      });
    }

    for (const key in this.path) {
      this.path[key].attr({
        fill: 'transparent',
        stroke: this.fgColor,
        'stroke-width': 0.5
      });
    }
  }

  resize() {
    const width = this.svg.node.clientWidth;
    const height = this.svg.node.clientHeight;

    let rectSize = Math.min(width, height) * 0.6;

    this.rect.size(rectSize, rectSize);
    this.rect.center(width * 0.5, height * 0.5);
    this.plotPath(0);

    let promise = new Promise((resolve, reject) => {
      this.animate().then(() => {
        resolve();
      });
    });

    return promise;
  }

  plotPath(pos) {
    const bbox = this.rect.bbox();
    const dw = bbox.width * 0.2;
    const dh = bbox.height * 0.2;
    this.path.width.plot(`M ${bbox.x},${bbox.y} C${bbox.x},${bbox.y - dw} ${bbox.x2},${bbox.y - dw} ${bbox.x2},${bbox.y}`);
    this.path.height.plot(`M ${bbox.x},${bbox.y} C${bbox.x - dh},${bbox.y} ${bbox.x - dh},${bbox.y2} ${bbox.x},${bbox.y2}`);
    this.text.width.center(bbox.cx, bbox.y - dw * 0.75);
    this.text.height.center(bbox.x - dh * 0.75, bbox.cy);

    if (pos > 0) {
      this.text.width.text(`${Math.floor(screenWidth * pos)}px`);
      this.text.height.text(`${Math.floor(screenHeight * pos)}px`);
    }
  }

  animate() {
    const area = this.rect.width() * this.rect.height();
    const scale = Math.sqrt(area / (screenWidth * screenHeight));
    const svgWidth = this.svg.node.clientWidth;
    const svgHeight = this.svg.node.clientHeight;

    let promise = new Promise((resolve, reject) => {
      this.rect.animate(2000, '<>', 1000)
        .size(screenWidth * scale, screenHeight * scale)
        .center(svgWidth * 0.5, svgHeight * 0.5)
        .during((pos) => {
          this.plotPath(pos);
        })
        .after(() => {
          resolve();
        });
    });

    return promise;
  }
}

window.addEventListener('load', () => {
  screenWidth = screen.width || window.parent.screen.width;
  screenHeight = screen.height || window.parent.screen.height;

  const btn = document.querySelector('#download');
  const container = document.querySelector('#wireframe');
  const wireframe = new Wireframe(container);
  const imageMaker = new ImageMaker();

  wireframe.resize().then(() => {
    imageMaker.createImage();
    btn.disabled = false;
    btn.addEventListener('click', () => {
      imageMaker.download();
    });
  });

}, false);