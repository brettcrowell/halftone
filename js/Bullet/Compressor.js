Bullet.Compressor = function(){

};

Bullet.Compressor.prototype = {

    getDifferenceMatrix: function (oldMatrix, newMatrix){

        var differenceMatrix = {},
            currentPixelIndex = 0;

        var mul = Bullet.Options.colorMultiplier;

        for(var r = 0; r < newMatrix.matrix.length; r++){

            var row = newMatrix.matrix[r];

            for(var c = 0; c < row.length; c++){

                var oldPixel = Bullet.Util.brightenRgb(oldMatrix.matrix[r][c], mul),
                    newPixel = Bullet.Util.brightenRgb(row[c], mul);

                var oldHsv = Bullet.Util.rgbToHsv(oldPixel),
                    newHsv = Bullet.Util.rgbToHsv(newPixel);

                var hueDiffPct = (Math.max(oldHsv[0], newHsv[0]) - Math.min(oldHsv[0], newHsv[0])) / Math.max(oldHsv[0], newHsv[0]);

                if(hueDiffPct > Bullet.Options.hueSimilarity){

                    var newPixelAdjusted = Bullet.Util.rgbToBase36(newPixel, Bullet.Options.colorBase);

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