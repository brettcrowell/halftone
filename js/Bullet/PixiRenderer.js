Bullet.PixiRenderer = function(){

    this.renderer = new PIXI.autoDetectRenderer(640,480,null,false,1,false); //
    this.stage = new PIXI.Stage(0xffffff);

    this._nodeCache = {};

}

Bullet.PixiRenderer.prototype = {

    getElement: function(){
        return this.renderer.view;
    },

    render: function(hexMatrix, resolution){

        var stage = this.stage,
            nodeCache = this._nodeCache,
            pixelWidth = 1 / resolution;

        var cols = 640 * resolution,
            nextPixel = 0;

        while(nextPixel < ((640 * resolution) * (480 * resolution))){

            var pixelColor = hexMatrix[nextPixel.toString(36)]; // @todo: parameterize this!

            if(pixelColor){

                var pixel = nodeCache[nextPixel.toString(36)];

                if(!pixel){

                    var graphics = new PIXI.Graphics();

                    graphics.beginFill(0x000000);
                    graphics.drawCircle(0, 0, pixelWidth);
                    graphics.endFill();

                    pixel = new PIXI.Sprite(graphics.generateTexture());

                    stage.addChild(pixel);

                    nodeCache[nextPixel.toString(36)] = pixel;

                }

                var rasterWidth = (pixelWidth * ((15 - Bullet.Util.hexToBw(pixelColor)) / 15));

                var currentRow = Math.floor(nextPixel / cols)

                var xOnCanvas = (nextPixel * pixelWidth) - ((pixelWidth * cols) * currentRow),
                    yOnCanvas = currentRow * pixelWidth;

                pixel.x = xOnCanvas + ((pixelWidth - rasterWidth) / 2);
                pixel.y = yOnCanvas + ((pixelWidth - rasterWidth) / 2);

                pixel.width = pixel.height = rasterWidth;

            }

            nextPixel++;

        }

        this.renderer.render(stage);

    }

};