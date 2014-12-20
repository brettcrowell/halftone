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

    render: function(encoderOutput){

        var context = this.context,
            cache = this.cache;
            matrix = encoderOutput.matrix,
            pixelSize = 1280 / encoderOutput.metadata.cols,
            pixelRadius = pixelSize / 2;

        var row, pixelColor, xOffset = 0;

        for(var r = 0; r < matrix.length; r++){

            row = matrix[r];

            if(encoderOutput.metadata.stagger && (r % 2 === 0)){
                xOffset = pixelRadius
            }

            for(var c = 0; c < row.length; c++){

                pixelColor = row[c];

                if(pixelColor !== null){

                    var adjPixelColor = Bullet.Util.brightenHexColor(pixelColor, Bullet.Options.colorMultiplier);

                    var xOnCanvas = (c * pixelSize) + xOffset,
                        yOnCanvas = r * pixelSize

                    context.clearRect(xOnCanvas, yOnCanvas, pixelSize, pixelSize);

                    var rasterWidth = Bullet.Util.getRasterWidth(pixelColor, pixelSize * 1.2);

                    xOnCanvas += (pixelSize - rasterWidth) / 2;
                    yOnCanvas += (pixelSize - rasterWidth) / 2;

                    var sourcePixel = this.cache[adjPixelColor];

                    if(!sourcePixel){
                        sourcePixel = this.cache[adjPixelColor] = this.generateCircle(adjPixelColor);
                    }

                    context.drawImage(cache[adjPixelColor], 0, 0, 50, 50, xOnCanvas, yOnCanvas, rasterWidth, rasterWidth);

                }

            }

            xOffset = 0;
        }
    }
};