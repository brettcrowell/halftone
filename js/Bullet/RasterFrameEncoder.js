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
    getRgbAtPoint: function (x, y, pixelSize, totalWidth, canvasPixelArray){

        var roundPixelRadius = Math.round(pixelSize / 2),
            roundPixelQuad = Math.round(pixelSize / 4),
            xCenter = x + roundPixelRadius,
            yCenter = y + roundPixelRadius;

        // gather pixels for upperLeft/uproundPixelSizeperRight, lowerLeft/lowerRight
        var quadColors = [

          this._getRgbAtPoint(xCenter, yCenter, totalWidth, canvasPixelArray),
          this._getRgbAtPoint(xCenter - roundPixelQuad, yCenter, totalWidth, canvasPixelArray),
          this._getRgbAtPoint(xCenter, yCenter - roundPixelQuad, totalWidth, canvasPixelArray),
          this._getRgbAtPoint(xCenter + roundPixelQuad, yCenter, totalWidth, canvasPixelArray),
          this._getRgbAtPoint(xCenter, yCenter + roundPixelQuad, totalWidth, canvasPixelArray)

        ];

        /*

        var sum = function(a, b) {
            return a + b;
        };

        var avgColor = [

          quadColors.map(function(rgb){ return rgb.r; }).reduce(sum) / 4,
          quadColors.map(function(rgb){ return rgb.g; }).reduce(sum) / 4,
          quadColors.map(function(rgb){ return rgb.b; }).reduce(sum) / 4

        ]*/

        var avgColor = [

            (quadColors[0].r + quadColors[1].r + quadColors[2].r + quadColors[3].r + quadColors[4].r) / 5,
            (quadColors[0].g + quadColors[1].g + quadColors[2].g + quadColors[3].g + quadColors[4].g) / 5,
            (quadColors[0].b + quadColors[1].b + quadColors[2].b + quadColors[3].b + quadColors[4].b) / 5

        ]

        return [avgColor[0], avgColor[1], avgColor[2]];

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

        var sampleSize = width / cols,
            staggerWidth = sampleSize / 2;

        var matrix = [];

        for(var r = 0; r < rows; r++){

            var currentRow = [];

            var offsetWidth = (r % 2 == 0) ? sampleSize : staggerWidth;

            for(var c = 0; c < cols; c++){

                var xOnCanvas = Math.round((c * sampleSize) + offsetWidth),
                    yOnCanvas = Math.round((r * sampleSize) + staggerWidth);

                var colorAtPoint = this.getRgbAtPoint(xOnCanvas, yOnCanvas, sampleSize, width, canvasPixelArray);

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