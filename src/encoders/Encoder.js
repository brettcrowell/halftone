export default class Encoder {

  constructor(options) {

    var defaultOptions = {

      cols: 240,
      rows: 135,
      webcamWidth: 640,
      aspectRatio: 16 / 9

    };

    this.options = options || defaultOptions;

    for (var option in defaultOptions) {
      if (!this.options[option]) {
        this.options[option] = defaultOptions[option];
      }
    }

    // auto-calculate the webcam height
    this.options.webcamHeight = (1 / this.options.aspectRatio) * this.options.webcamWidth;

  }

  _getRgbAtPoint(x, y, totalWidth, canvasPixelArray) {

    var dataIndex = (y * totalWidth + x) * 4;

    return {

      r: canvasPixelArray[dataIndex],
      g: canvasPixelArray[dataIndex + 1],
      b: canvasPixelArray[dataIndex + 2]

    };

  }

  // http://stackoverflow.com/questions/667045/getpixel-from-html-canvas
  // http://msdn.microsoft.com/en-us/library/ie/ff974957%28v=vs.85%29.aspx
  getPixelRgb(x, y, pixelSize, totalWidth, canvasPixelArray) {

    var roundPixelRadius = Math.round(pixelSize / 2),
      xCenter = x + roundPixelRadius,
      yCenter = y + roundPixelRadius;

    var rgbAtCenter = this._getRgbAtPoint(xCenter, yCenter, totalWidth, canvasPixelArray);

    return [rgbAtCenter.r, rgbAtCenter.g, rgbAtCenter.b];

  }

  /**
   *
   * @param {CanvasPixelArray} canvasPixelArray
   * @param resolution
   * @returns {Array}
   */

  encodeFrame(canvasPixelArray, stagger) {}

}