Bullet.SvgRenderer = function(){

    this.element = document.createElementNS(Bullet.Options.svgNamespace, 'svg');
    this._nodeCache = [];

}

Bullet.SvgRenderer.prototype = {

    getElement: function(){
      return this.element;
    },

    render: function(encoderOutput){

        var pixelWidth = 1280 / encoderOutput.metadata.cols,
            pixelRadius = pixelSize / 2;

        var nodeCache = this._nodeCache,
            element = this.element;

        _.each(encoderOutput.matrix, function(row, r){

            if(!nodeCache[r]){ nodeCache.push([]); }

            _.each(row, function(pixelColor, c){

                if(pixelColor !== null){

                    var cachedDomNode = nodeCache[r][c];

                    if(cachedDomNode){

                        var pixel = nodeCache[r][c];

                    } else {

                        var pixel = document.createElementNS(Bullet.Options.svgNamespace, "circle");

                        var xOnCanvas = (c * pixelSize) + pixelRadius,
                            yOnCanvas = (r * pixelSize) + pixelRadius;

                        if(encoderOutput.metadata.stagger && (r % 2 === 0)){
                            xOnCanvas += pixelRadius
                        }

                        pixel.setAttributeNS(null, "cx", xOnCanvas);
                        pixel.setAttributeNS(null, "cy", yOnCanvas);

                        element.appendChild(pixel);

                        nodeCache[r].push(pixel);

                    }

                    // set pixel color
                    pixel.setAttributeNS(null, "fill", pixelColor);

                    var rasterWidth = Bullet.Util.getRasterWidth(pixelColor,
                                                                 pixelRadius,
                                                                 encoderOutput.metadata.maxLumens,
                                                                 encoderOutput.metadata.minLumens);

                    // rasterbating the pixels (changing diameter based on shade)
                    pixel.setAttributeNS(null, "r", rasterWidth);


                }

            });

        });

    }

};