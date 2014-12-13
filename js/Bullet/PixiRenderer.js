Bullet.PixiRenderer = function(){

    this.renderer = new PIXI.autoDetectRenderer(640,480, null, false, true); //
    this.stage = new PIXI.Stage(0xffffff);

}

Bullet.PixiRenderer.prototype = {

    getElement: function(){
        return this.renderer.view;
    },

    render: function(hexMatrix, resolution){

        var renderStart = new Date().getTime();

        var stage = this.stage,
            pixelWidth = 1 / resolution,
            pixelRadius = pixelWidth / 2;

        for (var i = this.stage.children.length - 1; i >= 0; i--) {
            this.stage.removeChild(this.stage.children[i]);
        };

        this.renderer.render(stage);

        _.each(hexMatrix, function(row, r){

            _.each(row, function(pixelColor, c){

                if(pixelColor !== null){

                    var pixel = new PIXI.Graphics();

                    var xOnCanvas = (c * pixelWidth) + pixelRadius,
                        yOnCanvas = (r * pixelWidth) + pixelRadius;

                    var rasterRadius = (pixelRadius * ((15 - Bullet.Util.hexToBw(pixelColor)) / 15));

                    pixel.beginFill(0x000000);
                    pixel.drawCircle(xOnCanvas, yOnCanvas, rasterRadius);
                    pixel.endFill();

                    stage.addChild(pixel);

                }

            });

        });

        this.renderer.render(stage);

        console.log(new Date().getTime() - renderStart)

    }

};