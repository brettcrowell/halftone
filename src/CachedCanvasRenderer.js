Halftone.CachedCanvasRenderer = function(options){

    this.options = {

        colorBase: 16,
        pixelSize: 20,
        invert: true

    };

    if(options){
        for(var key in this.options){
            if(options[key]){
                this.options[key] = options[key];
            }
        }
    }

    this.cache = {};
    this.element = document.createElement('canvas');
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

        var rgb = Halftone.Util.baseToRgb(basedColor, base);
        var luminance = Halftone.Util.getRgbLuminance(rgb);

        if(this.options.invert){ luminance = 1 - luminance; }

        var rasterSize = luminance * ((pixelSize) / 2);

        var xOnCanvas = Math.floor(pixelSize / 2);
        var yOnCanvas = xOnCanvas;

        context.beginPath();
        context.fillStyle = (this.options.invert) ? '#FFFFFF' : '#000000';
        context.fillRect(0, 0, pixelSize, pixelSize);
        context.fillStyle = (this.options.invert) ? '#000000' : '#FFFFFF';
        context.arc(xOnCanvas, yOnCanvas, rasterSize, 0, Math.PI * 2, false);
        context.fill();
        context.closePath();

        return canvas;

    },

    getCachedPixel: function(pixelColor, pixelSize){

        var sourceIndex = parseInt(pixelColor, this.options.colorBase);
        var cachedPixel;

        if(this.cache[pixelSize]){

            cachedPixel = this.cache[pixelSize][sourceIndex];

        } else {

            this.cache[pixelSize] = [];

        }

        this.cache[pixelSize][sourceIndex] = cachedPixel || this.generateCircle(pixelColor, pixelSize);

        return this.cache[pixelSize][sourceIndex];

    },

    render: function(encoderOutput){

        var matrix = encoderOutput.matrix,
            cols = encoderOutput.metadata.cols,
            rows = encoderOutput.metadata.rows;

        var pixelSize = this.options.pixelSize + (this.options.pixelSize % 2);
        var pixelRadius = pixelSize / 2;

        this.element.width = cols * pixelSize;
        this.element.height = rows * pixelSize;

        for(var pixelColor in matrix) {

            var pixelIndexArray = matrix[pixelColor];

            var context = this.element.getContext('2d');

            var sourcePixel = this.getCachedPixel(pixelColor, pixelSize);

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
