Bullet.PixiRenderer = function(){

    this.renderer = new PIXI.autoDetectRenderer(1280,960,null,false,2,false); //
    this.stage = new PIXI.Stage(0xffffff);

    this._nodeCache = [];

}

Bullet.PixiRenderer.prototype = {

    getElement: function(){
        return this.renderer.view;
    },

    render: function(encoderOutput){

        var stage = this.stage,
            nodeCache = this._nodeCache,
            pixelWidth = 1280 / encoderOutput.metadata.cols,
            pixelRadius = pixelWidth / 2;

        _.each(encoderOutput.matrix, function(row, r){

            if(!nodeCache[r]){ nodeCache.push([]); }

            _.each(row, function(pixelColor, c){

                if(pixelColor !== null){

                    var pixel = nodeCache[r][c];

                    if(!pixel){

                        var graphics = new PIXI.Graphics();

                        graphics.beginFill(0x000000);
                        graphics.drawCircle(0, 0, pixelWidth);
                        graphics.endFill();

                        pixel = new PIXI.Sprite(graphics.generateTexture());
                        pixel.anchor.x = 0.5;
                        pixel.anchor.y = 0.5;

                        var xOnCanvas = (c * pixelWidth),
                            yOnCanvas = (r * pixelWidth);

                        pixel.x = xOnCanvas + pixelRadius;
                        pixel.y = yOnCanvas + pixelRadius;

                        if(encoderOutput.metadata.stagger && (r % 2 === 0)){
                            pixel.x += pixelRadius
                        }

                        stage.addChild(pixel);

                        nodeCache[r].push(pixel);

                    }

                    var rasterWidth = Bullet.Util.getRasterWidth(pixelColor,
                                                                 pixelWidth,
                                                                 encoderOutput.metadata.maxLumens,
                                                                 encoderOutput.metadata.minLumens);

                    pixel.width = pixel.height = rasterWidth;

                }

            });

        });

        this.renderer.render(stage);

    }

};