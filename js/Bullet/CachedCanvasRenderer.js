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

    generateCircle: function(color){

        var canvas = document.createElement('canvas'),
            context = canvas.getContext('2d');

        canvas.width = 50;
        canvas.height = 50;

        context.beginPath();
        context.arc(25, 25, 25, 0, Math.PI * 2, false);
        context.fillStyle = color;
        context.fill();
        context.closePath();

        return canvas;

    },

    _renderColor: function(pixelColor, pixelSize, pixelRadius, cols, pixelIndexArray, context){

        var cache = this.cache,
            adjPixelColor = Bullet.Util.brightenHexColor(pixelColor, Bullet.Options.colorMultiplier),
            rasterWidth = Bullet.Util.getRasterWidth(adjPixelColor, pixelSize),
            sourcePixel = cache[adjPixelColor];

        if (!sourcePixel) {
            sourcePixel = this.cache[adjPixelColor] = this.generateCircle(adjPixelColor);
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
              yOnCanvas = row * pixelSize

            context.clearRect(xOnCanvas, yOnCanvas, pixelSize, pixelSize);

            xOnCanvas += (pixelSize - rasterWidth) / 2;
            yOnCanvas += (pixelSize - rasterWidth) / 2;

            context.drawImage(sourcePixel, 0, 0, 50, 50, xOnCanvas, yOnCanvas, rasterWidth, rasterWidth);

            xOffset = 0;


        }

    },

    render: function(encoderOutput){

        var context = this.context,
            matrix = encoderOutput.matrix,
            cols = encoderOutput.metadata.cols,
            pixelSize = 1280 / cols,
            pixelRadius = pixelSize / 2;

        for(var pixelColor in matrix) {

            this._renderColor(pixelColor, pixelSize, pixelRadius, cols, matrix[pixelColor], context)

        }

    }
};