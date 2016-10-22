export default class ImageSource {

  constructor(srcPath, width, height) {

    this.width = width;
    this.height = height;

    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.image = new Image();

    this.image.onload = function () {
      this.context.drawImage(this.image, 0, 0);
    }.bind(this);

    this.image.src = srcPath;

  }

  getFrame() {
    return this.context.getImageData(0, 0, this.width, this.height).data;
  }

}