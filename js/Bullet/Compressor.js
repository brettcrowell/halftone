Bullet.Compressor = function(){

};

Bullet.Compressor.prototype = {

    getDifferenceMatrix: function (oldMatrix, newMatrix){

        var differenceMatrix = [];

        for(var r = 0; r < newMatrix.matrix.length; r++){

            var row = newMatrix.matrix[r],
                differenceRow = [];

            for(var c = 0; c < row.length; c++){

                var oldPixel = oldMatrix.matrix[r][c],
                    newPixel = row[c];

                var oldValue = Bullet.Util.hexToHsv(oldPixel)[2],
                    newValue = Bullet.Util.hexToHsv(newPixel)[2];

                var brightnessDiff = Math.max(oldValue, newValue) - Math.min(oldValue, newValue);

                if(brightnessDiff < Bullet.Options.minPixelSimilarity){

                    // new pixel color is 'similar enough' to old to omit
                    differenceRow.push(null);

                } else {

                    // new pixel color is significantly different from old
                    differenceRow.push(newPixel);

                }

            }

            differenceMatrix.push(differenceRow);

        }

        return { metadata: newMatrix.metadata, matrix: differenceMatrix };

    }

}