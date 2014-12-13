Bullet.SvgRenderer = function(){

    this.element = document.createElementNS(Bullet.Options.svgNamespace, 'svg');
    this._nodeCache = [];

}

Bullet.SvgRenderer.prototype = {

    getElement: function(){
      return this.element;
    },

    render: function(hexMatrix, resolution){

        var pixelWidth = 1 / resolution,
            pixelRadius = pixelWidth / 2;

        var nodeCache = this._nodeCache,
            element = this.element;

        _.each(hexMatrix, function(row, r){

            if(!nodeCache[r]){ nodeCache.push([]); }

            _.each(row, function(pixelColor, c){

                if(pixelColor !== null){

                    var xOnCanvas = (c * pixelWidth) + pixelRadius,
                        yOnCanvas = (r * pixelWidth) + pixelRadius;

                    var cachedDomNode = nodeCache[r][c];

                    if(cachedDomNode){

                        var pixel = nodeCache[r][c];

                    } else {

                        var pixel = document.createElementNS(Bullet.Options.svgNamespace, "circle");

                        pixel.setAttributeNS(null, "cx", xOnCanvas);
                        pixel.setAttributeNS(null, "cy", yOnCanvas);

                        element.appendChild(pixel);

                        nodeCache[r].push(pixel);

                    }

                    // set pixel color
                    pixel.setAttributeNS(null, "fill", pixelColor);

                    // rasterbating the pixels (changing diameter based on shade)
                    pixel.setAttributeNS(null, "r", (pixelRadius * ((15 - Bullet.Util.hexToBw(pixelColor)) / 15)));


                }

            });

        });

    }

};