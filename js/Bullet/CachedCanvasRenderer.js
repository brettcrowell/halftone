Bullet.CachedCanvasRenderer = function(){

    this.cache = {};
    this.element = document.createElement('canvas');
    this.context = this.element.getContext('2d');

    this.element.setAttribute('class', 'renderer');
    this.element.width = 1280;
    this.element.height = 960;

}

Bullet.CachedCanvasRenderer.prototype = {

    getElement: function(){
        return this.element;
    },

    generateCircle: function(colorBase36){

        var canvas = document.createElement('canvas'),
            context = canvas.getContext('2d');

        canvas.width = 20;
        canvas.height = 20;

        var rgb = Bullet.Util.base36toRgb(colorBase36);

        var rgbString = "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")";

        context.beginPath();
        context.arc(10, 10, 10, 0, Math.PI * 2, false);
        context.fillStyle = rgbString;
        context.fill();
        context.closePath();

        return canvas;

    },

    _partialRender: function(pixelColor, pixelIndexArray, cols, pixelSize, pixelRadius){

        var context = this.context,
            cache = this.cache;

        var rasterWidth = pixelSize, //Bullet.Util.getRasterWidth(pixelColor, pixelSize),
            sourcePixel = cache[pixelColor];

        if (!sourcePixel) {
            sourcePixel = this.cache[pixelColor] = this.generateCircle(pixelColor);
        }

        var row, col, xOffset;

        for (var p = 0; p < pixelIndexArray.length; p++) {

            var pixelIndex = pixelIndexArray[p];

            // decode pixelIndex (find row and col)
            row = Math.floor(pixelIndex / cols);
            col = pixelIndex % cols;

            if (row % 2 === 0) {
                xOffset = pixelRadius
            }

            var xOnCanvas = (col * pixelSize) + xOffset,
              yOnCanvas = row * pixelSize;

            context.clearRect(xOnCanvas, yOnCanvas, pixelSize, pixelSize);

            xOnCanvas += (pixelSize - rasterWidth) / 2;
            yOnCanvas += (pixelSize - rasterWidth) / 2;

            context.drawImage(sourcePixel, 0, 0, 20, 20, xOnCanvas, yOnCanvas, rasterWidth, rasterWidth);

            xOffset = 0;


        }

    },

    render: function(encoderOutput){

        var matrix = encoderOutput.matrix,
            cols = encoderOutput.metadata.cols,
            pixelSize = 1280 / cols,
            pixelRadius = pixelSize / 2;

        for(var pixelColor in matrix) {

            var pixelIndexArray = matrix[pixelColor];

            this._partialRender(pixelColor, pixelIndexArray, cols, pixelSize, pixelRadius)


        }

    }
};