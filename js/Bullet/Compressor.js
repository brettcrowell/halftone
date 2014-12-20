Bullet.Compressor = function(){

};

Bullet.Compressor.prototype = {

    getDifferenceMatrix: function (oldMatrix, newMatrix){

        var totalPixelsSeen = 0,
            numChangedPixels = 0;

        var differenceMatrix = [];

        for(var r = 0; r < newMatrix.matrix.length; r++){

            var row = newMatrix.matrix[r],
                differenceRow = [];

            for(var c = 0; c < row.length; c++){

                var newPixel = row[c];

                var oldPixel = oldMatrix.matrix[r][c],
                  similarity = Bullet.Util.getLuminanceSimilarity(oldPixel, newPixel);

                if(similarity > Bullet.Options.minPixelSimilarity){

                    // new pixel color is 'similar enough' to old to omit
                    differenceRow.push(null);

                } else {

                    // new pixel color is significantly different from old
                    differenceRow.push(newPixel);
                    numChangedPixels++;

                }

            }

            differenceMatrix.push(differenceRow);

        }

        return { metadata: newMatrix.metadata, matrix: differenceMatrix };

    }

}