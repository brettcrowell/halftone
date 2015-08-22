Halftone.CachedCanvasRenderer = function(options){

    this.options = {

        colorBase: 16,
        pixelSize: 10,
        invert: true

    };

    if(options){
        for(var key in this.options){
            if(options[key]){
                this.options[key] = options[key];
            }
        }
    }

    var colorBase = this.options.colorBase,
        colorSpace = Math.pow(colorBase, 3);

    this.cache = new Array(colorSpace);
    this.element = document.createElement('canvas');
    this.context = this.element.getContext('2d');

    this.element.setAttribute('class', 'renderer');

};

Halftone.CachedCanvasRenderer.prototype = {

    getElement: function(){
        return this.element;
    },

    generateCircle: function(basedColor, pixelSize){

        var canvas = document.createElement('canvas'),
            context = canvas.getContext('2d');

        canvas.width = canvas.height = pixelSize;

        var base = this.options.colorBase;

        var rgb = Halftone.Util.baseToRgb(basedColor, base),
            rgbString = "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")";

        var luminance = Halftone.Util.getRasterWidth(basedColor, base);

        if(this.options.invert){ luminance = 1 - luminance; }

        var rasterSize = luminance * ((pixelSize) / 2);

        var xOnCanvas = Math.floor(pixelSize / 2);
        var yOnCanvas = xOnCanvas;

        context.beginPath();
        context.fillStyle = "#ffffff";

        context.fillStyle = Halftone.Util.rgbToHex(Halftone.Util.brightenRgb(rgb, 0.5));
        context.fillStyle = (this.options.invert) ? '#FFFFFF' : '#000000';

        context.fillRect(0, 0, pixelSize, pixelSize);
        context.arc(xOnCanvas, yOnCanvas, rasterSize + 1, 0, Math.PI * 2, false);
        context.fillStyle = rgbString;
        context.fill();
        context.closePath();

        return canvas;

    },

    render: function(encoderOutput){

        var matrix = encoderOutput.matrix,
            cols = encoderOutput.metadata.cols,
            rows = encoderOutput.metadata.rows,
            pixelSize = this.options.pixelSize,
            pixelRadius = pixelSize / 2;

        pixelSize += pixelSize % 2;

        // allow for dynamic resizing of element
        this.element.width = cols * this.options.pixelSize;
        this.element.height = rows * this.options.pixelSize;

        for(var pixelColor in matrix) {

            var pixelIndexArray = matrix[pixelColor];

            var context = this.context,
                cache = this.cache;

            var sourceIndex = parseInt(pixelColor, this.options.colorBase),
                sourcePixel = cache[sourceIndex];

            if (!sourcePixel) {
                sourcePixel = this.cache[sourceIndex] = this.generateCircle(pixelColor, pixelSize);
            }

            var row, col, xOffset;

            var lastPixelIndex = -1;

            for (var p = 0; p < pixelIndexArray.length; p++) {

                var pixelIndex = pixelIndexArray[p];

                if(pixelIndex === 0){
                  pixelIndex = ++lastPixelIndex;
                }

                lastPixelIndex = pixelIndex;

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
