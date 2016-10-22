export default class LuminanceCompressor {

  constructor() {

    this.options = {
      precision: 50,
      similarity: 0.025
    };

  };

  getDifferenceMatrix(oldMatrix, newMatrix) {

    var differenceMatrix = {},
      currentPixelIndex = 0,
      numPixelsChanged = 0;

    for (var r = 0; r < newMatrix.matrix.length; r++) {

      var row = newMatrix.matrix[r];

      for (var c = 0; c < row.length; c++) {

        var newPixelLuminance = utils.getRgbLuminance(row[c], this.options.precision);

        if (oldMatrix && oldMatrix.matrix && oldMatrix.matrix[r] && oldMatrix.matrix[r][c]) {

          // if there is an old matrix to compare to, find the matching pixel
          var oldPixelLuminance = utils.getRgbLuminance(oldMatrix.matrix[r][c], this.options.precision);

          if (oldMatrix.metadata.cols == newMatrix.metadata.cols) {

            if (Math.abs(oldPixelLuminance - newPixelLuminance) < this.options.similarity) {

              // if the pixel color hasn't changed enough, don't change it
              currentPixelIndex++;

              continue;

            }

          }

        }

        // either old matrix doesn't exist or pixel color has shifted beyond deltaE tolerance

        if (!differenceMatrix[newPixelLuminance]) {
          differenceMatrix[newPixelLuminance] = [];
        }

        // current pixel color is significantly different previous column
        differenceMatrix[newPixelLuminance].push(currentPixelIndex);

        currentPixelIndex++;
        numPixelsChanged++;

      }

    }

    newMatrix.metadata.numPixelsChanged = numPixelsChanged;

    return {metadata: newMatrix.metadata, matrix: differenceMatrix};

  }

};
