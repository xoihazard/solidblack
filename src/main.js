import Wireframe from './wireframe.js'
import ImageMaker from './imagemaker.js'

window.addEventListener('load', () => {
  const screenWidth = screen.width || window.parent.screen.width;
  const screenHeight = screen.height || window.parent.screen.height;

  const btn = document.querySelector('#download');
  const container = document.querySelector('#wireframe');

  const wireframe = new Wireframe(container, screenWidth, screenHeight);
  const imageMaker = new ImageMaker();

  wireframe.resize().then(() => {
    imageMaker.createImage(screenWidth, screenHeight);
    btn.disabled = false;
    btn.addEventListener('click', () => {
      imageMaker.download();
    });
  });

}, false);