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

    encodeFrame: function (canvasPixelArray, resolution){

        var width = 640,
            height = 480; // @todo: REMOVE THIS

        var matrix = [];

        var rows = height * resolution,
            cols = width * resolution;

        for(var r = 0; r < rows; r++){

            var currentRow = [];

            for(var c = 0; c < cols; c++){

                var xOnCanvas = Math.round(c * (1 / resolution)),
                    yOnCanvas = Math.round(r * (1 / resolution));

                var colorAtPoint = this.getHexAtPoint(xOnCanvas, yOnCanvas, width, canvasPixelArray, true);

                currentRow.push(colorAtPoint);

            }

            matrix.push(currentRow)

        }

        // store this matrix in the cache for comparison
        this.lastEncodedFrame = matrix;

        return matrix;

    }

}