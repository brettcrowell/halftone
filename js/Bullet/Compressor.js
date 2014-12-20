Bullet.Compressor = function(){

};

Bullet.Compressor.prototype = {

    getDifferenceMatrix: function (oldMatrix, newMatrix){

        var totalPixelsSeen = 0,
            numChangedPixels = 0;

        var differenceMatrix = [];

        _.each(newMatrix.matrix, function(row, r){

            var differenceRow = [];

            _.each(row, function(newPixel, c){

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

                totalPixelsSeen++;

            }.bind(this));

            differenceMatrix.push(differenceRow);

        }.bind(this));

        return { metadata: newMatrix.metadata, matrix: differenceMatrix };

    }

}