Bullet.Compressor = function(){

};

Bullet.Compressor.prototype = {

    getDifferenceMatrix: function (oldMatrix, newMatrix){

        var differenceMatrix = {},
            currentPixel = 0;

        for(var r = 0; r < newMatrix.matrix.length; r++){

            var row = newMatrix.matrix[r];

            for(var c = 0; c < row.length; c++){

                var oldPixel = oldMatrix.matrix[r][c],
                    newPixel = row[c];

                var oldHsv = Bullet.Util.hexToHsv(oldPixel),
                    newHsv = Bullet.Util.hexToHsv(newPixel);

                var hueDiff = Math.max(oldHsv[0], newHsv[0]) - Math.min(oldHsv[0], newHsv[0]),
                    brightnessDiff = Math.max(oldHsv[2], newHsv[2]) - Math.min(oldHsv[2], newHsv[2]);

                if(brightnessDiff < Bullet.Options.brightnessSimilarity && hueDiff < Bullet.Options.hueSimilarity){

                } else {

                    if(!differenceMatrix[newPixel]){
                        differenceMatrix[newPixel] = [];
                    }

                    // new pixel color is significantly different from old
                    differenceMatrix[newPixel].push(currentPixel);

                }

                currentPixel++;

            }

        }

        return { metadata: newMatrix.metadata, matrix: differenceMatrix };

    }

}