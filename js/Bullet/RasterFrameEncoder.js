Bullet.RasterFrameEncoder = function(){

    this.lastEncodedFrame = null;

};

Bullet.RasterFrameEncoder.prototype = {

    // http://stackoverflow.com/questions/667045/getpixel-from-html-canvas
    // http://msdn.microsoft.com/en-us/library/ie/ff974957%28v=vs.85%29.aspx
    getHexAtPoint: function (x, y, totalWidth, canvasPixelArray, shorthand){

        var dataIndex = (y * totalWidth + x) * 4;

        var mul = Bullet.Options.colorMultiplier;

        var r = Math.min(canvasPixelArray[dataIndex]   * mul, 255),
            g = Math.min(canvasPixelArray[dataIndex+1] * mul, 255),
            b = Math.min(canvasPixelArray[dataIndex+2] * mul, 255);

        hex = ("000000" + Bullet.Util.rgbToHex(r,g,b)).slice(-6);

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

    encodeFrame: function (canvasPixelArray, stagger){

        var width = Bullet.Options.videoConstraints.video.mandatory.maxWidth,
            height = Bullet.Options.videoConstraints.video.mandatory.maxHeight;

        var cols = Bullet.Options.quality,
            rows = (cols / width) * height;

        var pixelWidth = width / cols,
            staggerWidth = pixelWidth / 2;

        var matrix = [];

        for(var r = 0; r < rows; r++){

            var currentRow = [];

            var offsetWidth = (r % 2 == 0) ? pixelWidth : staggerWidth;

            for(var c = 0; c < cols; c++){

                var xOnCanvas = Math.round((c * pixelWidth) + offsetWidth),
                    yOnCanvas = Math.round((r * pixelWidth) + staggerWidth);

                var colorAtPoint = this.getHexAtPoint(xOnCanvas, yOnCanvas, width, canvasPixelArray, true);

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
                stagger: stagger
            },

            matrix: matrix

        }

    }

}