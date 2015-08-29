Halftone.LuminanceCompressor = function(){

  this.options = {
    luminancePrecision: 100
  };

};

Halftone.LuminanceCompressor.prototype = {

    getDifferenceMatrix: function (oldMatrix, newMatrix){

        var differenceMatrix = {},
            currentPixelIndex = 0;

        for(var r = 0; r < newMatrix.matrix.length; r++){

            var row = newMatrix.matrix[r];

            for(var c = 0; c < row.length; c++){

              var newPixelLuminance = Halftone.Util.getRgbLuminance(row[c], this.options.luminancePrecision);

              if(oldMatrix && oldMatrix.matrix && oldMatrix.matrix[r] && oldMatrix.matrix[r][c]){

                // if there is an old matrix to compare to, find the matching pixel
                var oldPixelLuminance = Halftone.Util.getRgbLuminance(oldMatrix.matrix[r][c], this.options.luminancePrecision);

                if(oldPixelLuminance == newPixelLuminance){

                  // if the pixel color hasn't changed enough, don't change it
                  currentPixelIndex++;

                  continue;

                }

              }

              // either old matrix doesn't exist or pixel color has shifted beyond deltaE tolerance

              if(!differenceMatrix[newPixelLuminance]){
                differenceMatrix[newPixelLuminance] = [];
              }

              // current pixel color is significantly different previous column
              differenceMatrix[newPixelLuminance].push(currentPixelIndex);

              currentPixelIndex++;

            }

        }

        return { metadata: newMatrix.metadata, matrix: differenceMatrix };

    }

};
