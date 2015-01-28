Halftone.CachedCanvasRenderer = function(){

    var colorBase = Halftone.Options.colorBase,
        colorSpace = Math.pow(colorBase, 3);

    this.cache = new Array(colorSpace);
    this.element = document.createElement('canvas');
    this.context = this.element.getContext('2d');

    this.element.setAttribute('class', 'renderer');

    this.pixelSize = Halftone.Options.pixelSize;

    var pixelModTwo = this.pixelSize % 2;

    // pixelSie must be even
    this.pixelSize += pixelModTwo;

    var cols = Halftone.Options.quality,
        aspect = Halftone.Options.aspectRatio;

    this.element.width = cols * this.pixelSize;
    this.element.height = this.element.width * (1 / aspect);

};

Halftone.CachedCanvasRenderer.prototype = {

    getElement: function(){
        return this.element;
    },

    generateCircle: function(basedColor, pixelSize){

        var canvas = document.createElement('canvas'),
            context = canvas.getContext('2d');

        canvas.width = canvas.height = pixelSize;

        var base = Halftone.Options.colorBase;

        var rgb = Halftone.Util.baseToRgb(basedColor, base),
            rgbString = "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")";

        var luminance = Halftone.Util.getRasterWidth(basedColor, base);

        if(Halftone.Options.invert){ luminance = 1 - luminance; }

        var rasterSize = luminance * ((pixelSize) / 2);

        var xOnCanvas = Math.floor(pixelSize / 2),
            yOnCanvas = xOnCanvas;

        context.beginPath();
        context.fillStyle = (Halftone.Options.invert) ? '#FFFFFF' : '#000000';
        context.fillRect(0, 0, pixelSize, pixelSize);
        context.arc(xOnCanvas, yOnCanvas, rasterSize, 0, Math.PI * 2, false);
        context.fillStyle = rgbString;
        context.fill();
        context.closePath();

        return canvas;

    },

    render: function(encoderOutput){

        var matrix = encoderOutput.matrix,
            cols = encoderOutput.metadata.cols,
            pixelSize = this.pixelSize,
            pixelRadius = pixelSize / 2;

        pixelSize += pixelSize % 2;

        for(var pixelColor in matrix) {

            var pixelIndexArray = matrix[pixelColor];

            var context = this.context,
                cache = this.cache;

            var sourceIndex = parseInt(pixelColor, Halftone.Options.colorBase),
                sourcePixel = cache[sourceIndex];

            if (!sourcePixel) {
                sourcePixel = this.cache[sourceIndex] = this.generateCircle(pixelColor, pixelSize);
            }

            var row, col, xOffset;

            for (var p = 0; p < pixelIndexArray.length; p++) {

                var pixelIndex = pixelIndexArray[p];

                // decode pixelIndex (find row and col)
                row = Math.floor(pixelIndex / cols);
                col = pixelIndex % cols;

                if (row % 2 === 0) {
                    xOffset = pixelRadius;
                }

                var xOnCanvas = (col * pixelSize) + xOffset,
                    yOnCanvas = row * pixelSize;

                context.drawImage(sourcePixel, 0, 0, pixelSize, pixelSize, xOnCanvas, yOnCanvas, pixelSize, pixelSize);

                xOffset = 0;


            }

        }

    }
};
