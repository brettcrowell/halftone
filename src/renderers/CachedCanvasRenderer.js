import utils from "../utils";

export default class CachedCanvasRenderer {

  constructor(options) {

    this.options = {

      colorBase: 16,
      pixelSize: 20,
      invert: true

    };

    if (options) {
      for (var key in this.options) {
        if (options[key]) {
          this.options[key] = options[key];
        }
      }
    }

    this.cache = {};
    this.element = document.createElement('canvas');
    this.element.setAttribute('class', 'renderer');

  }

  getElement() {
    return this.element;
  }

  /**
   *
   * @param pixelMagnitude [0...14]
   * @param quadrantSize
   * @returns {Element}
   */

  generateCircle(pixelMagnitude, quadrantSize) {

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    canvas.width = canvas.height = quadrantSize;

    //@todo allow for inversions again someday
    //@todo 14 is a magic number here! (represents 1 less than 1111
    var pixelRadius = (pixelMagnitude / 14) * ((quadrantSize) / 2);

    var xOnCanvas = Math.floor(quadrantSize / 2);
    var yOnCanvas = xOnCanvas;

    context.beginPath();
    context.fillStyle = (this.options.invert) ? '#FFFFFF' : '#000000';
    context.fillRect(0, 0, quadrantSize, quadrantSize);
    context.fillStyle = (this.options.invert) ? '#000000' : '#FFFFFF';
    context.arc(xOnCanvas, yOnCanvas, pixelRadius, 0, Math.PI * 2, false);
    context.fill();
    context.closePath();

    return canvas;

  }

  getCachedPixel(pixelMagnitude, quadrantSize) {

    if (!this.cache[quadrantSize] || !this.cache[quadrantSize][pixelMagnitude]) {

      this.cache[quadrantSize] = this.cache[quadrantSize] || [];
      this.cache[quadrantSize][pixelMagnitude] = this.generateCircle(pixelMagnitude, quadrantSize);

    }

    return this.cache[quadrantSize][pixelMagnitude];

  }

  render(encoderOutput) {

    var matrix = encoderOutput.matrix,
      cols = encoderOutput.metadata.cols,
      rows = encoderOutput.metadata.rows;

    var pixelSize = this.options.pixelSize + (this.options.pixelSize % 2);
    var pixelRadius = pixelSize / 2;

    this.element.width = cols * pixelSize;
    this.element.height = rows * pixelSize;

    for (var pixelColor in matrix) {

      var pixelIndexArray = matrix[pixelColor];

      var context = this.element.getContext('2d');

      var sourcePixel = this.getCachedPixel(pixelColor, pixelSize);

      var row, col, xOffset;

      var lastPixelIndex = -1;

      for (var p = 0; p < pixelIndexArray.length; p++) {

        var pixelIndex = pixelIndexArray[p];

        if (pixelIndex === 0) {
          pixelIndex = ++lastPixelIndex;
        }

        lastPixelIndex = pixelIndex;

        // decode pixelIndex (find row and col)
        row = Math.floor(pixelIndex / cols);
        col = pixelIndex % cols;

        if (row % 2 === 0) {
          xOffset = pixelRadius;
        }

        var xOnCanvas = (col * pixelSize) + xOffset,
          yOnCanvas = row * pixelSize;

        context.drawImage(sourcePixel, 0, 0, pixelSize, pixelSize, xOnCanvas, yOnCanvas, pixelSize, pixelSize);

        xOffset = 0;


      }

    }

  }
}