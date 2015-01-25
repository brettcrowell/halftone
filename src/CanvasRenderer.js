Halftone.CanvasRenderer = function(){

    this.element = document.createElement('canvas');
    this.context = this.element.getContext('2d');

    this.element.width = 1280;
    this.element.height = 960;

}

Halftone.CanvasRenderer.prototype = {

    getElement: function(){
        return this.element;
    },

    render: function(encoderOutput){

        var canvas = this.element,
            context = this.context,
            matrix = encoderOutput.matrix,
            pixelWidth = 1280 / encoderOutput.metadata.cols,
            pixelRadius = pixelSize / 2;

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

                    var xOnCanvas = (c * pixelSize) + pixelRadius + xOffset,
                        yOnCanvas = (r * pixelSize) + pixelRadius;

                    var rasterRadius = Halftone.Util.getRasterWidth(pixelColor,
                                                                  pixelRadius,
                                                                  encoderOutput.metadata.maxLumens,
                                                                  encoderOutput.metadata.minLumens);

                    context.beginPath();
                    context.arc(xOnCanvas, yOnCanvas, rasterRadius, 0, 6, false);
                    context.fillStyle = pixelColor;
                    context.fill();
                    context.closePath();

                }

            }

            xOffset = 0;
        }
    }
};
