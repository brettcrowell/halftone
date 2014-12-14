Bullet.RasterFrameEncoder = function(){

    this.lastEncodedFrame = null;

};

Bullet.RasterFrameEncoder.prototype = {

    // http://stackoverflow.com/questions/667045/getpixel-from-html-canvas
    // http://msdn.microsoft.com/en-us/library/ie/ff974957%28v=vs.85%29.aspx
    getHexAtPoint: function (x, y, totalWidth, canvasPixelArray, shorthand){

        var dataIndex = (y * totalWidth + x) * 4;

        var r = canvasPixelArray[dataIndex],
            g = canvasPixelArray[dataIndex+1],
            b = canvasPixelArray[dataIndex+2];

        hex = ("000000" + Bullet.Util.rgbToHex(r, g, b)).slice(-6);

        if(!shorthand){
            return "#" + hex;
        }

        return "#" + hex[0] + hex[2] + hex[4];

    },

    /**
     *
     * @param {CanvasPixelArray} canvasPixelArray
     * @param resolution
     * @returns {Array}
     */

    encodeFrame: function (canvasPixelArray){

        var width = Bullet.Options.videoConstraints.video.mandatory.maxWidth,
            height = Bullet.Options.videoConstraints.video.mandatory.maxHeight;

        var cols = Bullet.Options.quality,
            rows = (cols / width) * height;

        var minLumens = 15,
            maxLumens = 0;

        var matrix = [];

        for(var r = 0; r < rows; r++){

            var currentRow = [];

            for(var c = 0; c < cols; c++){

                var xOnCanvas = Math.round(c * (width / cols)),
                    yOnCanvas = Math.round(r * (width / cols));

                var colorAtPoint = this.getHexAtPoint(xOnCanvas, yOnCanvas, width, canvasPixelArray, true);

                minLumens = Math.min(Bullet.Util.hexToGrayscaleRgb(colorAtPoint), minLumens);
                maxLumens = Math.max(Bullet.Util.hexToGrayscaleRgb(colorAtPoint), maxLumens);

                currentRow.push(colorAtPoint);

            }

            matrix.push(currentRow)

        }

        // store this matrix in the cache for comparison
        this.lastEncodedFrame = matrix;

        return {

            metadata: {
                rows: rows,
                cols: cols,
                minLumens: minLumens,
                maxLumens: maxLumens
            },

            matrix: matrix

        }

    }

}