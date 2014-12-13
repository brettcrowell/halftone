Bullet.PixiRenderer = function(){

    this.renderer = new PIXI.autoDetectRenderer(640,480); //
    this.stage = new PIXI.Stage(0xffffff);

    this._nodeCache = [];

}

Bullet.PixiRenderer.prototype = {

    getElement: function(){
        return this.renderer.view;
    },

    render: function(hexMatrix, resolution){

        var renderStart = new Date().getTime();

        var stage = this.stage,
            nodeCache = this._nodeCache,
            pixelWidth = 1 / resolution,
            pixelRadius = pixelWidth / 2;

        _.each(hexMatrix, function(row, r){

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

                        stage.addChild(pixel);

                        nodeCache[r].push(pixel);

                    }

                    var rasterWidth = (pixelWidth * ((15 - Bullet.Util.hexToBw(pixelColor)) / 15));

                    var xOnCanvas = (c * pixelWidth),
                        yOnCanvas = (r * pixelWidth);

                    pixel.x = xOnCanvas + ((pixelWidth - rasterWidth) / 2);
                    pixel.y = yOnCanvas + ((pixelWidth - rasterWidth) / 2);

                    pixel.width = pixel.height = rasterWidth;

                }

            });

        });

        this.renderer.render(stage);

        console.log(new Date().getTime() - renderStart)

    }

};