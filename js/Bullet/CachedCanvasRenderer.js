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

        var canvas = this.element,
            context = this.context,
            cache = this.cache;
            matrix = encoderOutput.matrix,
            pixelWidth = 1280 / encoderOutput.metadata.cols,
            pixelRadius = pixelWidth / 2;

        var row, pixelColor, xOffset = 0;

        context.clearRect(0, 0, canvas.width, canvas.height);

        for(var r = 0; r < matrix.length; r++){

            row = matrix[r];

            if(encoderOutput.metadata.stagger && (r % 2 === 0)){
                xOffset = pixelRadius
            }

            for(var c = 0; c < row.length; c++){

                pixelColor = row[c];

                if(pixelColor !== null){

                    var rasterWidth = Bullet.Util.getRasterWidth(pixelColor, pixelWidth * 1.2);

                    var xOnCanvas = ((c * pixelWidth) + xOffset) + ((pixelWidth - rasterWidth) / 2),
                        yOnCanvas = (r * pixelWidth) + ((pixelWidth - rasterWidth) / 2) ;

                    var sourcePixel = this.cache[pixelColor];

                    if(!sourcePixel){
                        sourcePixel = this.cache[pixelColor] = this.generateCircle(pixelColor);
                    }

                    context.drawImage(cache[pixelColor], 0, 0, 50, 50, xOnCanvas, yOnCanvas, rasterWidth, rasterWidth);

                }

            }

            xOffset = 0;
        }
    }
};