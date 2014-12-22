Bullet.Compressor = function(){

};

Bullet.Compressor.prototype = {

    getDifferenceMatrix: function (oldMatrix, newMatrix){

        var differenceMatrix = {},
            currentPixelIndex = 0;

        var multiplier = Bullet.Options.colorMultiplier;

        for(var r = 0; r < newMatrix.matrix.length; r++){

            var row = newMatrix.matrix[r];

            for(var c = 0; c < row.length; c++){

                var oldPixel = oldMatrix.matrix[r][c],
                    newPixel = row[c];

                var oldHsv = Bullet.Util.hexToHsv(oldPixel),
                    newHsv = Bullet.Util.hexToHsv(newPixel);

                var hueDiff = Math.max(oldHsv[0], newHsv[0]) - Math.min(oldHsv[0], newHsv[0]),
                    brightnessDiff = Math.max(oldHsv[2], newHsv[2]) - Math.min(oldHsv[2], newHsv[2]);

                if(brightnessDiff > Bullet.Options.brightnessSimilarity || hueDiff > Bullet.Options.hueSimilarity){

                    //var newPixelAdjusted = Bullet.Util.brightenHexColor(newPixel, multiplier)
                    var newPixelAdjusted = Bullet.Util.hsvToHex(newHsv[0], newHsv[1], Math.min(newHsv[2] * multiplier, 1));


                    if(!differenceMatrix[newPixelAdjusted]){
                        differenceMatrix[newPixelAdjusted] = [];
                    }

                    // new pixel color is significantly different from old
                    differenceMatrix[newPixelAdjusted].push(currentPixelIndex);

                }

                currentPixelIndex++;

            }

        }

        return { metadata: newMatrix.metadata, matrix: differenceMatrix };

    }

}