Halftone.Compressor = function(){

};

Halftone.Compressor.prototype = {

    getDifferenceMatrix: function (oldMatrix, newMatrix){

        var differenceMatrix = {},
            currentPixelIndex = 0;

        var mul = Halftone.Options.colorMultiplier;

        var lastKnownColor = -1;

        for(var r = 0; r < newMatrix.matrix.length; r++){

            var row = newMatrix.matrix[r];

            for(var c = 0; c < row.length; c++){

              var newPixel = Halftone.Util.brightenRgb(row[c], mul);

              if(oldMatrix && oldMatrix.matrix && oldMatrix.matrix[r] && oldMatrix.matrix[r][c]){

                var oldPixel = Halftone.Util.brightenRgb(oldMatrix.matrix[r][c], mul);

                if(Halftone.Util.getCIE76(oldPixel, newPixel) < Halftone.Options.maxDeltaE){

                  currentPixelIndex++;

                  continue;

                }

              }

              var newPixelAdjusted = Halftone.Util.rgbToBase(newPixel, Halftone.Options.colorBase);

              if(!differenceMatrix[newPixelAdjusted]){
                differenceMatrix[newPixelAdjusted] = [];
              }

              if(newPixelAdjusted === lastKnownColor){

                // new pixel color is significantly different from old
                differenceMatrix[newPixelAdjusted].push(0);

              } else {

                // new pixel color is significantly different from old
                differenceMatrix[newPixelAdjusted].push(currentPixelIndex);

              }

              lastKnownColor = newPixelAdjusted;
              currentPixelIndex++;

            }

        }

        return { metadata: newMatrix.metadata, matrix: differenceMatrix };

    }

};
