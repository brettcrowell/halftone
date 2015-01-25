(function(root, undefined) {

  "use strict";


/* Halftone main */

// Base function.
var Halftone = function() {
  // Add functionality here.
  return true;
};


// Version.
Halftone.VERSION = '0.0.0';


// Export to the root, which is probably `window`.
root.Halftone = Halftone;


Halftone.Options = {

    viewportId: 'viewport',
    svgId: 'display',
    sourceCanvasId: 'imgSource',
    svgNamespace: "http://www.w3.org/2000/svg",
    testImage: './img/test-image.jpg',
    quality: 200,
    pixelSize: 6,
    aspectRatio: 4 / 3,
    colorMultiplier: 1.75,
    colorBase: 10, // max 36
    stagger: true,
    maxPctRgbDifference: 0.02,
    frameRate: 7,
    backgroundColor: '#eee',
    videoConstraints: {
        video: {
            mandatory: {
                maxWidth: 320,
                maxHeight: 240
            }
        }
    }

}


Halftone.Util = {

    // http://www.html5canvastutorials.com/advanced/html5-canvas-load-image-data-url/
    // http://stackoverflow.com/questions/6735470/get-pixel-color-from-canvas-on-mouseover
    rgbToHex: function(r, g, b) {

        if (r > 255 || g > 255 || b > 255)
            throw "Invalid color component";
        return ((r << 16) | (g << 8) | b).toString(16);

    },

    hexToDecimal: _.memoize(function(hex){
        return parseInt(hex.substr(1), 16);
    }),

    hexToRgb: _.memoize(function (hex){

        hex = hex.substr(1);

        return {

            r: parseInt(hex[0] + hex[0], 16),
            g: parseInt(hex[1] + hex[1], 16),
            b: parseInt(hex[2] + hex[2], 16)

        }

    }),

    brightenHexColor: _.memoize(function(hex, mul){

        var rgb = this.hexToRgb(hex);

        var r = Math.min(rgb.r * mul, 255),
          g = Math.min(rgb.g * mul, 255),
          b = Math.min(rgb.b * mul, 255);

        hex = ("000000" + Halftone.Util.rgbToHex(r,g,b)).slice(-6);

        return "#" + hex[0] + hex[2] + hex[4];

    }),

    // http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c

    hexToHsv: _.memoize(function(hex){

        var r = parseInt(hex[1] + hex[1], 16),
          g = parseInt(hex[2] + hex[2], 16),
          b = parseInt(hex[3] + hex[3], 16);

        return this.rgbToHsv(r,g,b);
    }),

    hsvToHex: function(h, s, v){

        var rgb = this.hsvToRgb(h, s, v),
          hex = ("000000" + this.rgbToHex(rgb[0],rgb[1],rgb[2])).slice(-6);

        return "#" + hex[0] + hex[2] + hex[4];

    },

    getRasterWidth: function(colorBase36, colorBase){

        var rgb = this.baseToRgb(colorBase36, colorBase),
            hsv = this.rgbToHsv(rgb);

        return hsv[2];

    },

    rgbToGrayscale: function(rgb){

        // http://bobpowell.net/grayscale.aspx

        return (rgb[0] *.3) + (rgb[1] *.59) + (rgb[2] *.11);

    },

    /**
     * Converts an RGB color value to HSV. Conversion formula
     * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
     * Assumes r, g, and b are contained in the set [0, 255] and
     * returns h, s, and v in the set [0, 1].
     *
     * @param   Number  r       The red color value
     * @param   Number  g       The green color value
     * @param   Number  b       The blue color value
     * @return  Array           The HSV representation
     */
    rgbToHsv: function(rgb){
        var r = rgb[0]/255, g = rgb[1]/255, b = rgb[2]/255;
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, v = max;

        var d = max - min;
        s = max == 0 ? 0 : d / max;

        if(max == min){
            h = 0; // achromatic
        }else{
            switch(max){
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return [h, s, v];
    },

    /**
    * Converts an HSV color value to RGB. Conversion formula
    * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
    * Assumes h, s, and v are contained in the set [0, 1] and
    * returns r, g, and b in the set [0, 255].
    *
    * @param   Number  h       The hue
    * @param   Number  s       The saturation
    * @param   Number  v       The value
    * @return  Array           The RGB representation
    */
    hsvToRgb: function(hsv){

        var h = hsv[0], s = hsv[1], v = hsv[2];
        var r, g, b;

        var i = Math.floor(h * 6);
        var f = h * 6 - i;
        var p = v * (1 - s);
        var q = v * (1 - f * s);
        var t = v * (1 - (1 - f) * s);

        switch(i % 6){
            case 0: r = v, g = t, b = p; break;
            case 1: r = q, g = v, b = p; break;
            case 2: r = p, g = v, b = t; break;
            case 3: r = p, g = q, b = v; break;
            case 4: r = t, g = p, b = v; break;
            case 5: r = v, g = p, b = q; break;
        }

        return [r * 255, g * 255, b * 255];

    },

    rgbToBase: function(rgb, base){

        var range = base - 1;

        var r = Math.round((rgb[0]/255) * range).toString(base),
            g = Math.round((rgb[1]/255) * range).toString(base),
            b = Math.round((rgb[2]/255) * range).toString(base);

        return r + g + b;

    },

    baseToRgb: function(base36, base){

        var range = base - 1;

        var r = Math.round((parseInt(base36[0], base) / range) * 255),
            g = Math.round((parseInt(base36[1], base) / range) * 255),
            b = Math.round((parseInt(base36[2], base) / range) * 255);

        return [r,g,b];

    },

    brightenRgb: function(rgb, factor){

        var r = Math.min(rgb[0] * factor, 255),
            g = Math.min(rgb[1] * factor, 255),
            b = Math.min(rgb[2] * factor, 255);

        return [r,g,b];

    },

    getRgbSimilarity: function (rgb1, rgb2){

        var dec1 = this.rgbToGrayscale(rgb1),
            dec2 = this.rgbToGrayscale(rgb2);

        var max = Math.max(dec1,dec2),
            min = Math.min(dec1,dec2);

        return (max - min) / max;

    },

    average: function(arr){

        var sum = _.reduce(arr, function(a,b){ return a + b; });

        return sum / arr.length;

    },

    hasGetUserMedia: function() {
        return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia || navigator.msGetUserMedia);
    }

}


Halftone.CachedCanvasRenderer = function(){

    var colorBase = Halftone.Options.colorBase,
        colorSpace = Math.pow(colorBase, 3);

    this.cache = new Array(colorSpace);
    this.element = document.createElement('canvas');
    this.context = this.element.getContext('2d');

    this.element.setAttribute('class', 'renderer');

    this.pixelSize = Halftone.Options.pixelSize,

    // pixelSie must be even
    this.pixelSize += this.pixelSize % 2;

    var cols = Halftone.Options.quality,
        aspect = Halftone.Options.aspectRatio

    this.element.width = cols * this.pixelSize;
    this.element.height = this.element.width * (1 / aspect);

}

Halftone.CachedCanvasRenderer.prototype = {

    getElement: function(){
        return this.element;
    },

    generateCircle: function(basedColor, pixelSize){

        var canvas = document.createElement('canvas'),
            context = canvas.getContext('2d');

        canvas.width = canvas.height = pixelSize;

        var base = Halftone.Options.colorBase;

        var rgb = Halftone.Util.baseToRgb(basedColor, base),
            rgbString = "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")";

        var rasterSize = Halftone.Util.getRasterWidth(basedColor, base) * ((pixelSize) / 2),
            xOnCanvas = Math.floor(pixelSize / 2),
            yOnCanvas = xOnCanvas;

        context.beginPath();
        context.fillRect(0, 0, pixelSize, pixelSize);
        context.arc(xOnCanvas, yOnCanvas, rasterSize, 0, Math.PI * 2, false);
        context.fillStyle = rgbString;
        context.fill();
        context.closePath();

        return canvas;

    },

    render: function(encoderOutput){

        var matrix = encoderOutput.matrix,
            cols = encoderOutput.metadata.cols,
            pixelSize = this.pixelSize,
            pixelRadius = pixelSize / 2;

        pixelSize += pixelSize % 2;

        for(var pixelColor in matrix) {

            var pixelIndexArray = matrix[pixelColor];

            var context = this.context,
                cache = this.cache;

            var sourceIndex = parseInt(pixelColor, Halftone.Options.colorBase),
                sourcePixel = cache[sourceIndex];

            if (!sourcePixel) {
                sourcePixel = this.cache[sourceIndex] = this.generateCircle(pixelColor, pixelSize);
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
                    yOnCanvas = row * pixelSize;

                context.drawImage(sourcePixel, 0, 0, pixelSize, pixelSize, xOnCanvas, yOnCanvas, pixelSize, pixelSize);

                xOffset = 0;


            }

        }

    }
};


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


Halftone.Compressor = function(){

};

Halftone.Compressor.prototype = {

    getDifferenceMatrix: function (oldMatrix, newMatrix){

        var differenceMatrix = {},
            currentPixelIndex = 0;

        var mul = Halftone.Options.colorMultiplier;

        for(var r = 0; r < newMatrix.matrix.length; r++){

            var row = newMatrix.matrix[r];

            for(var c = 0; c < row.length; c++){

                var oldPixel = Halftone.Util.brightenRgb(oldMatrix.matrix[r][c], mul),
                    newPixel = Halftone.Util.brightenRgb(row[c], mul);

                if(Halftone.Util.getRgbSimilarity(oldPixel, newPixel) > Halftone.Options.maxPctRgbDifference){

                    var newPixelAdjusted = Halftone.Util.rgbToBase(newPixel, Halftone.Options.colorBase);

                    if(!differenceMatrix[newPixelAdjusted]){
                        differenceMatrix[newPixelAdjusted] = [];
                    }

                    // new pixel color is significantly different from old
                    differenceMatrix[newPixelAdjusted].push(currentPixelIndex);

                }

                currentPixelIndex++;

            }

        }

        return { metadata: newMatrix.metadata, matrix: differenceMatrix };

    }

}


Halftone.PixiRenderer = function(){

    this.renderer = new PIXI.autoDetectRenderer(1280,960,null,false,2,false); //
    this.stage = new PIXI.Stage(0xffffff);

    this._nodeCache = [];

}

Halftone.PixiRenderer.prototype = {

    getElement: function(){
        return this.renderer.view;
    },

    render: function(encoderOutput){

        var stage = this.stage,
            nodeCache = this._nodeCache,
            pixelWidth = 1280 / encoderOutput.metadata.cols,
            pixelRadius = pixelSize / 2;

        _.each(encoderOutput.matrix, function(row, r){

            if(!nodeCache[r]){ nodeCache.push([]); }

            _.each(row, function(pixelColor, c){

                if(pixelColor !== null){

                    var pixel = nodeCache[r][c];

                    if(!pixel){

                        var graphics = new PIXI.Graphics();

                        graphics.beginFill(0x000000);
                        graphics.drawCircle(0, 0, pixelSize);
                        graphics.endFill();

                        pixel = new PIXI.Sprite(graphics.generateTexture());
                        pixel.anchor.x = 0.5;
                        pixel.anchor.y = 0.5;

                        var xOnCanvas = (c * pixelSize),
                            yOnCanvas = (r * pixelSize);

                        if(encoderOutput.metadata.stagger && (r % 2 === 0)){
                            xOnCanvas += pixelRadius
                        }

                        pixel.x = xOnCanvas + pixelRadius;
                        pixel.y = yOnCanvas + pixelRadius;

                        stage.addChild(pixel);

                        nodeCache[r].push(pixel);

                    }

                    var rasterWidth = Halftone.Util.getRasterWidth(pixelColor,
                                                                 pixelSize,
                                                                 encoderOutput.metadata.maxLumens,
                                                                 encoderOutput.metadata.minLumens);

                    pixel.width = pixel.height = rasterWidth;

                }

            });

        });

        this.renderer.render(stage);

    }

};


Halftone.RasterFrameEncoder = function(){

    this.lastEncodedFrame = null;

};

Halftone.RasterFrameEncoder.prototype = {

    _getRgbAtPoint: function(x, y, totalWidth, canvasPixelArray){

        var dataIndex = (y * totalWidth + x) * 4;

        return {

          r: canvasPixelArray[dataIndex],
          g: canvasPixelArray[dataIndex+1],
          b: canvasPixelArray[dataIndex+2]

        };

    },

    // http://stackoverflow.com/questions/667045/getpixel-from-html-canvas
    // http://msdn.microsoft.com/en-us/library/ie/ff974957%28v=vs.85%29.aspx
    getRgbAtPoint: function (x, y, pixelSize, totalWidth, canvasPixelArray){

        var roundPixelRadius = Math.round(pixelSize / 2),
            roundPixelQuad = Math.round(pixelSize / 4),
            xCenter = x + roundPixelRadius,
            yCenter = y + roundPixelRadius;

        // gather pixels for upperLeft/uproundPixelSizeperRight, lowerLeft/lowerRight
        var quadColors = [

          this._getRgbAtPoint(xCenter, yCenter, totalWidth, canvasPixelArray),
          this._getRgbAtPoint(xCenter - roundPixelQuad, yCenter, totalWidth, canvasPixelArray),
          this._getRgbAtPoint(xCenter, yCenter - roundPixelQuad, totalWidth, canvasPixelArray),
          this._getRgbAtPoint(xCenter + roundPixelQuad, yCenter, totalWidth, canvasPixelArray),
          this._getRgbAtPoint(xCenter, yCenter + roundPixelQuad, totalWidth, canvasPixelArray)

        ];

        /*

        var sum = function(a, b) {
            return a + b;
        };

        var avgColor = [

          quadColors.map(function(rgb){ return rgb.r; }).reduce(sum) / 4,
          quadColors.map(function(rgb){ return rgb.g; }).reduce(sum) / 4,
          quadColors.map(function(rgb){ return rgb.b; }).reduce(sum) / 4

        ]*/

        var avgColor = [

            (quadColors[0].r + quadColors[1].r + quadColors[2].r + quadColors[3].r + quadColors[4].r) / 5,
            (quadColors[0].g + quadColors[1].g + quadColors[2].g + quadColors[3].g + quadColors[4].g) / 5,
            (quadColors[0].b + quadColors[1].b + quadColors[2].b + quadColors[3].b + quadColors[4].b) / 5

        ]

        return [avgColor[0], avgColor[1], avgColor[2]];

    },

    /**
     *
     * @param {CanvasPixelArray} canvasPixelArray
     * @param resolution
     * @returns {Array}
     */

    encodeFrame: function (canvasPixelArray, stagger){

        var width = Halftone.Options.videoConstraints.video.mandatory.maxWidth,
            height = Halftone.Options.videoConstraints.video.mandatory.maxHeight;

        var cols = Halftone.Options.quality,
            rows = (cols / width) * height;

        var sampleSize = width / cols,
            staggerWidth = sampleSize / 2;

        var matrix = [];

        for(var r = 0; r < rows; r++){

            var currentRow = [];

            var offsetWidth = (r % 2 == 0) ? sampleSize : staggerWidth;

            for(var c = 0; c < cols; c++){

                var xOnCanvas = Math.round((c * sampleSize) + offsetWidth),
                    yOnCanvas = Math.round((r * sampleSize) + staggerWidth);

                var colorAtPoint = this.getRgbAtPoint(xOnCanvas, yOnCanvas, sampleSize, width, canvasPixelArray);

                currentRow.push(colorAtPoint);

            }

            matrix.push(currentRow)

        }

        // store this matrix in the cache for comparison
        this.lastEncodedFrame = matrix;

        return {

            metadata: {
                rows: rows,
                cols: cols,
                stagger: stagger
            },

            matrix: matrix

        }

    }

}


Halftone.SvgRenderer = function(){

    this.element = document.createElementNS(Halftone.Options.svgNamespace, 'svg');
    this._nodeCache = [];

}

Halftone.SvgRenderer.prototype = {

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

                        var pixel = document.createElementNS(Halftone.Options.svgNamespace, "circle");

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

                    var rasterWidth = Halftone.Util.getRasterWidth(pixelColor,
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


Halftone.WebcamSource = function(){

    this.width = Halftone.Options.videoConstraints.video.mandatory.maxWidth;
    this.height = Halftone.Options.videoConstraints.video.mandatory.maxHeight;

    this.video = document.createElement('video');

    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.localMediaStream = null;

    if (!Halftone.Util.hasGetUserMedia()) {
        alert('getUserMedia() is not supported in your browser');
    }

    // http://www.html5rocks.com/en/tutorials/getusermedia/intro/

    // Not showing vendor prefixes.
    navigator.webkitGetUserMedia(Halftone.Options.videoConstraints, this.startVideo.bind(this), this.errorCallback);

}

Halftone.WebcamSource.prototype = {

    errorCallback: function(e) {
        alert('Reeeejected!', e);
    },

    startVideo: function(stream) {

        this.localMediaStream = stream;

        this.video.autoplay = true;
        this.video.src = window.URL.createObjectURL(this.localMediaStream);

        // Note: onloadedmetadata doesn't fire in Chrome when using it with getUserMedia.
        // See crbug.com/110938.
        this.video.onloadedmetadata = function(e) {
            // Ready to go. Do some stuff.
        };

    },

    /**
     *
     * @param video
     * @param canvasContext
     * @returns {CanvasPixelArray}
     */

    getFrame: function(video, canvasContext){

        this.context.drawImage(this.video, 0, 0, this.width, this.height);

        return this.context.getImageData(0, 0, this.width, this.height).data;

    }

}


}(this));
