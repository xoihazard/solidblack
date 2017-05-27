import SVG from 'svg.js'

export default class {
  constructor(container, screenWidth, screenHeight) {

    this.fgColor = '#ddd';
    this.svg = SVG(container);
    this.rect = this.svg.rect();
    this.screenWidth = screenWidth;
    this.screenHeight = screenHeight;

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

    const rectSize = Math.min(width, height) * 0.6;

    this.rect.size(rectSize, rectSize);
    this.rect.center(width * 0.5, height * 0.5);
    this.plotPath(0);

    const promise = new Promise((resolve, reject) => {
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
      this.text.width.text(`${Math.floor(this.screenWidth * pos)}px`);
      this.text.height.text(`${Math.floor(this.screenHeight * pos)}px`);
    }
  }

  animate() {
    const area = this.rect.width() * this.rect.height();
    const scale = Math.sqrt(area / (this.screenWidth * this.screenHeight));
    const svgWidth = this.svg.node.clientWidth;
    const svgHeight = this.svg.node.clientHeight;

    const promise = new Promise((resolve, reject) => {
      this.rect.animate(2000, '<>', 1000)
        .size(this.screenWidth * scale, this.screenHeight * scale)
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