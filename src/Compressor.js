Halftone.Compressor = function(){

};

Halftone.Compressor.prototype = {

    getDifferenceMatrix: function (oldMatrix, newMatrix){

        var differenceMatrix = {},
            currentPixelIndex = 0;

        var mul = Halftone.Options.colorMultiplier;

        var lastKnownColor = -1,
            lastKnownColorAdjusted = '#000';

        for(var r = 0; r < newMatrix.matrix.length; r++){

            var row = newMatrix.matrix[r];

            for(var c = 0; c < row.length; c++){

              var newPixel = Halftone.Util.brightenRgb(row[c], mul);

              if(oldMatrix && oldMatrix.matrix && oldMatrix.matrix[r] && oldMatrix.matrix[r][c]){

                // if there is an old matrix to compare to, find the matching pixel
                var oldPixel = Halftone.Util.brightenRgb(oldMatrix.matrix[r][c], mul);

                if(Halftone.Util.getCIE76(oldPixel, newPixel) < Halftone.Options.maxInterframeDeltaE){

                  // if the pixel color hasn't changed enough (based on deltaE), don't change it
                  currentPixelIndex++;

                  continue;

                }

              }

              // either old matrix doesn't exist or pixel color has shifted beyond deltaE tolerance

              var newPixelAdjusted = Halftone.Util.rgbToBase(newPixel, Halftone.Options.colorBase);

              if(!differenceMatrix[newPixelAdjusted]){
                differenceMatrix[newPixelAdjusted] = [];
              }

              if(newPixelAdjusted === lastKnownColorAdjusted){
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

        return { metadata: newMatrix.metadata, matrix: differenceMatrix };

    }

};
