import utils from "../utils";

export default class Compressor {

  getDifferenceMatrix(oldMatrix, newMatrix, colorBase = 16, colorMultiplier = 1, maxInterframeDeltaE = 0) {

    var differenceMatrix = {},
      currentPixelIndex = 0;

    var lastKnownColor = -1,
      lastKnownColorAdjusted = '#000';

    for (var r = 0; r < newMatrix.matrix.length; r++) {

      var row = newMatrix.matrix[r];

      for (var c = 0; c < row.length; c++) {

        var newPixel = utils.brightenRgb(row[c], colorMultiplier);

        if (oldMatrix && oldMatrix.matrix && oldMatrix.matrix[r] && oldMatrix.matrix[r][c]) {

          // if there is an old matrix to compare to, find the matching pixel
          var oldPixel = utils.brightenRgb(oldMatrix.matrix[r][c], colorMultiplier);

          if (maxInterframeDeltaE > 0) {

            // if an exact match isn't required, calculate distance between colors

            if (utils.getCIE76(oldPixel, newPixel) < maxInterframeDeltaE) {

              // if the pixel color hasn't changed enough (based on deltaE), don't change it
              currentPixelIndex++;

              continue;

            } else {

              // exact match required.  don't bother calculating non-exact matches

              if (utils.rgbEquals(oldPixel, newPixel)) {

                currentPixelIndex++;

                continue;

              }

            }

          }


        }

        // either old matrix doesn't exist or pixel color has shifted beyond deltaE tolerance

        var newPixelAdjusted = utils.rgbToBase(newPixel, colorBase);

        if (!differenceMatrix[newPixelAdjusted]) {
          differenceMatrix[newPixelAdjusted] = [];
        }

        if (newPixelAdjusted === lastKnownColorAdjusted) {
          //if(Halftone.Util.getCIE76(newPixel, lastKnownColor) < Halftone.Options.maxIntraframeDeltaE){

          // colors are encoded in streaks of 'similar enough' colored pixels
          differenceMatrix[lastKnownColorAdjusted].push(0);

        } else {

          // current pixel color is significantly different previous column
          differenceMatrix[newPixelAdjusted].push(currentPixelIndex);

          lastKnownColor = newPixel;
          lastKnownColorAdjusted = newPixelAdjusted;

        }

        currentPixelIndex++;

      }

    }

    return {metadata: newMatrix.metadata, matrix: differenceMatrix};

  }

}