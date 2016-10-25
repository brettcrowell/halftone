import Encoder from './Encoder';

export default class MatrixFrameEncoder extends Encoder {

  /**
   *
   * @param {CanvasPixelArray} canvasPixelArray
   * @param resolution
   * @returns {Array}
   */

  encodeFrame(canvasPixelArray, stagger) {

    var width = this.options.webcamWidth, height = this.options.webcamHeight;

    var cols = this.options.cols,
      rows = (cols / width) * height;

    var sampleSize = width / cols,
      staggerWidth = sampleSize / 2;

    var matrix = [];

    for (var r = 0; r < rows; r++) {

      var currentRow = [];

      var offsetWidth = (r % 2 === 0) ? sampleSize : staggerWidth;

      for (var c = 0; c < cols; c++) {

        var xOnCanvas = Math.round((c * sampleSize) + offsetWidth),
          yOnCanvas = Math.round((r * sampleSize) + staggerWidth);

        var colorAtPoint = this.getPixelRgb(xOnCanvas, yOnCanvas, sampleSize, width, canvasPixelArray);

        currentRow.push(colorAtPoint);

      }

      matrix.push(currentRow);

    }

    return {

      metadata: {
        rows: rows,
        cols: cols,
        stagger: stagger
      },

      matrix: matrix

    };

  }

}