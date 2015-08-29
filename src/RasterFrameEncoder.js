Halftone.RasterFrameEncoder = function(options){

    var defaultOptions = {

        cols: 200,
        webcamWidth: 640,
        aspectRatio: 16/9

    };

    this.options = options || defaultOptions;

    for(var option in defaultOptions){
        if(!this.options[option]){
            this.options[option] = defaultOptions[option];
        }
    }

    // auto-calculate the webcam height
    this.options.webcamHeight = (1 / this.options.aspectRatio) * this.options.webcamWidth;

    this.lastEncodedFrame = null;

};

Halftone.RasterFrameEncoder.prototype = {

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
    getPixelRgb: function (x, y, pixelSize, totalWidth, canvasPixelArray){

        var roundPixelRadius = Math.round(pixelSize / 2),
            xCenter = x + roundPixelRadius,
            yCenter = y + roundPixelRadius;

        var rgbAtCenter = this._getRgbAtPoint(xCenter, yCenter, totalWidth, canvasPixelArray);

        return [rgbAtCenter.r, rgbAtCenter.g, rgbAtCenter.b];

    },

    /**
     *
     * @param {CanvasPixelArray} canvasPixelArray
     * @param resolution
     * @returns {Array}
     */

    encodeFrame: function (canvasPixelArray, stagger){

        var width = this.options.webcamWidth, height = this.options.webcamHeight;

        var cols = this.options.cols,
            rows = (cols / width) * height;

        var sampleSize = width / cols,
            staggerWidth = sampleSize / 2;

        var matrix = [];

        for(var r = 0; r < rows; r++){

            var currentRow = [];

            var offsetWidth = (r % 2 === 0) ? sampleSize : staggerWidth;

            for(var c = 0; c < cols; c++){

                var xOnCanvas = Math.round((c * sampleSize) + offsetWidth),
                    yOnCanvas = Math.round((r * sampleSize) + staggerWidth);

                var colorAtPoint = this.getPixelRgb(xOnCanvas, yOnCanvas, sampleSize, width, canvasPixelArray);

                currentRow.push(colorAtPoint);

            }

            matrix.push(currentRow);

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

        };

    }

};
