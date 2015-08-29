Halftone.CachedCanvasLuminanceRenderer = function(options){

    this.options = {

        pixelSize: 20,
        autoPixelSize: true,
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

Halftone.CachedCanvasLuminanceRenderer.prototype = {

    getElement: function(){
        return this.element;
    },

    generateCircle: function(luminance, pixelSize){

        luminance = isNaN(luminance) ? 1 : luminance;

        var canvas = document.createElement('canvas'),
            context = canvas.getContext('2d');

        canvas.width = canvas.height = pixelSize;

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

    getCachedPixel: function(luminance, pixelSize){

        var cachedPixel;

        if(this.cache[pixelSize]){

            cachedPixel = this.cache[pixelSize][luminance];

        } else {

            this.cache[pixelSize] = [];

        }

        this.cache[pixelSize][luminance] = cachedPixel || this.generateCircle(luminance, pixelSize);

        return this.cache[pixelSize][luminance];

    },

    render: function(encoderOutput){

        var matrix = encoderOutput.matrix,
            cols = encoderOutput.metadata.cols,
            rows = encoderOutput.metadata.rows;

        var pixelSize = this.options.pixelSize + (this.options.pixelSize % 2);

        if(this.element.width != (cols * pixelSize)){

            if(this.options.autoPixelSize){
                pixelSize = this.options.pixelSize = parseInt(this.element.offsetWidth / cols, 10);
                pixelSize += pixelSize % 2;
            }

            this.element.width = cols * pixelSize;
            this.element.height = rows * pixelSize;

        }

        var pixelRadius = pixelSize / 2;

        for(var luminance in matrix) {

            var pixelsForThisLuminance = matrix[luminance];

            var context = this.element.getContext('2d');

            var sourcePixel = this.getCachedPixel(luminance, pixelSize);

            var row, col, xOffset;

            var lastPixelIndex = -1;

            for (var p = 0; p < pixelsForThisLuminance.length; p++) {

                var pixelIndex = pixelsForThisLuminance[p];

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
