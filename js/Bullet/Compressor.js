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

                var oldHsv = Bullet.Util.hexToHsv(oldPixel),
                    newHsv = Bullet.Util.hexToHsv(newPixel);

                var hueDiff = Math.max(oldHsv[0], newHsv[0]) - Math.min(oldHsv[0], newHsv[0]),
                    brightnessDiff = Math.max(oldHsv[2], newHsv[2]) - Math.min(oldHsv[2], newHsv[2]);

                if(brightnessDiff < Bullet.Options.brightnessSimilarity && hueDiff < Bullet.Options.hueSimilarity){

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