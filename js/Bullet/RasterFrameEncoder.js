Bullet.RasterFrameEncoder = function(){

    this.lastEncodedFrame = null;

};

Bullet.RasterFrameEncoder.prototype = {

    _getRgbAtPoint: function(x, y, totalWidth, canvasPixelArray){

        var dataIndex = (y * totalWidth + x) * 4;

        return {

          r: canvasPixelArray[dataIndex],
          g: canvasPixelArray[dataIndex+1],
          b: canvasPixelArray[dataIndex+2]

        };

    },

    // http://stackoverflow.com/questions/667045/getpixel-from-html-canvas
    // http://msdn.microsoft.com/en-us/library/ie/ff974957%28v=vs.85%29.aspx
    getHexAtPoint: function (x, y, pixelSize, totalWidth, canvasPixelArray, shorthand){

        var roundPixelRadius = Math.round(pixelSize / 2),
            roundPixelQuad = Math.round(pixelSize / 4),
            xCenter = x + roundPixelRadius,
            yCenter = y + roundPixelRadius;

        // gather pixels for upperLeft/uproundPixelSizeperRight, lowerLeft/lowerRight
        var quadColors = [

          this._getRgbAtPoint(xCenter - roundPixelQuad, yCenter, totalWidth, canvasPixelArray),
          this._getRgbAtPoint(xCenter, yCenter - roundPixelQuad, totalWidth, canvasPixelArray),
          this._getRgbAtPoint(xCenter + roundPixelQuad, yCenter, totalWidth, canvasPixelArray),
          this._getRgbAtPoint(xCenter, yCenter + roundPixelQuad, totalWidth, canvasPixelArray)

        ];

        var sum = function(a, b) {
            return a + b;
        };

        var avgColor = [

          quadColors.map(function(rgb){ return rgb.r; }).reduce(sum) / 4,
          quadColors.map(function(rgb){ return rgb.g; }).reduce(sum) / 4,
          quadColors.map(function(rgb){ return rgb.b; }).reduce(sum) / 4

        ]

        hex = ("000000" + Bullet.Util.rgbToHex(avgColor[0], avgColor[1], avgColor[2])).slice(-6);

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

        var pixelSize = width / cols,
            staggerWidth = pixelSize / 2;

        var matrix = [];

        for(var r = 0; r < rows; r++){

            var currentRow = [];

            var offsetWidth = (r % 2 == 0) ? pixelSize : staggerWidth;

            for(var c = 0; c < cols; c++){

                var xOnCanvas = Math.round((c * pixelSize) + offsetWidth),
                    yOnCanvas = Math.round((r * pixelSize) + staggerWidth);

                var colorAtPoint = this.getHexAtPoint(xOnCanvas, yOnCanvas, pixelSize, width, canvasPixelArray, true);

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