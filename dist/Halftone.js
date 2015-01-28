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
    pixelSize: 10,
    aspectRatio: 16 / 9,
    invert: false,
    colorMultiplier: 1,
    colorBase: 10, // max 36
    stagger: true,
    maxPctRgbDifference: 0.02,
    maxDeltaE: 5,
    frameRate: 10,
    backgroundColor: '#eee',
    webcam: {
      video: true,
      audio: false,
      width: 320,
      height: 240
    }

};


Halftone.Util = {

    // http://www.html5canvastutorials.com/advanced/html5-canvas-load-image-data-url/
    // http://stackoverflow.com/questions/6735470/get-pixel-color-from-canvas-on-mouseover
    rgbToHex: function(r, g, b) {

        if (r > 255 || g > 255 || b > 255) {
          throw "Invalid color component";
        }

        return ((r << 16) | (g << 8) | b).toString(16);

    },

    hexToDecimal: function(hex){
        //@todo re-memoize
        return parseInt(hex.substr(1), 16);
    },

    hexToRgb: function (hex){
      //@todo re-memoize
        hex = hex.substr(1);

        return {

            r: parseInt(hex[0] + hex[0], 16),
            g: parseInt(hex[1] + hex[1], 16),
            b: parseInt(hex[2] + hex[2], 16)

        };

    },

    brightenHexColor: function(hex, mul){
        //@todo re-memoize
        var rgb = this.hexToRgb(hex);

        var r = Math.min(rgb.r * mul, 255),
          g = Math.min(rgb.g * mul, 255),
          b = Math.min(rgb.b * mul, 255);

        hex = ("000000" + Halftone.Util.rgbToHex(r,g,b)).slice(-6);

        return "#" + hex[0] + hex[2] + hex[4];

    },

    // http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c

    hexToHsv: function(hex){
      //@todo re-memoize
        var r = parseInt(hex[1] + hex[1], 16),
          g = parseInt(hex[2] + hex[2], 16),
          b = parseInt(hex[3] + hex[3], 16);

        return this.rgbToHsv(r,g,b);
    },

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

        return (rgb[0] *0.3) + (rgb[1] *0.59) + (rgb[2] *0.11);

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
        s = max === 0 ? 0 : d / max;

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
            case 0:
              r = v;
              g = t;
              b = p;
            break;
            case 1:
              r = q;
              g = v;
              b = p;
            break;
            case 2:
              r = p;
              g = v;
              b = t;
            break;
            case 3:
              r = p;
              g = q;
              b = v;
            break;
            case 4:
              r = t;
              g = p;
              b = v;
            break;
            case 5:
              r = v;
              g = p;
              b = q;
            break;
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

      if(rgb){

        var r = Math.min(rgb[0] * factor, 255),
          g = Math.min(rgb[1] * factor, 255),
          b = Math.min(rgb[2] * factor, 255);

        return [r,g,b];

      }

      return [0,0,0];

    },

    getRgbSimilarity: function (rgb1, rgb2){

        var dec1 = this.rgbToGrayscale(rgb1),
            dec2 = this.rgbToGrayscale(rgb2);

        var max = Math.max(dec1,dec2),
            min = Math.min(dec1,dec2);

        return (max - min) / max;

    },

    getCIE76: function(rgb1, rgb2){

      var lab1 = colorConvert.rgb2lab(rgb1),
          lab2 = colorConvert.rgb2lab(rgb2);

      // http://colormine.org/delta-e-calculator/

      var lDistance = Math.max(lab2[0],lab1[0]) - Math.min(lab2[0],lab1[0]),
          aDistance = Math.max(lab2[1],lab1[1]) - Math.min(lab2[1],lab1[1]),
          bDistance = Math.max(lab2[2],lab1[2]) - Math.min(lab2[2],lab1[2]);

      var lDistanceSquared = Math.pow(lDistance, 2),
          aDistanceSquared = Math.pow(aDistance, 2),
          bDistanceSquared = Math.pow(bDistance, 2);

      var deltaE = Math.sqrt(Math.max((lDistanceSquared + aDistanceSquared - bDistanceSquared), 0));

      return deltaE;

    },

    average: function(arr){

        var sum = 0;

        for(var i = 0; i < arr.length; i++){
          sum += arr[i];
        }

        return sum / arr.length;

    },

    hasGetUserMedia: function() {
        return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia || navigator.msGetUserMedia);
    }

};


Halftone.CachedCanvasRenderer = function(){

    var colorBase = Halftone.Options.colorBase,
        colorSpace = Math.pow(colorBase, 3);

    this.cache = new Array(colorSpace);
    this.element = document.createElement('canvas');
    this.context = this.element.getContext('2d');

    this.element.setAttribute('class', 'renderer');

    this.pixelSize = Halftone.Options.pixelSize;

    var pixelModTwo = this.pixelSize % 2;

    // pixelSie must be even
    this.pixelSize += pixelModTwo;

    var cols = Halftone.Options.quality,
        aspect = Halftone.Options.aspectRatio;

    this.element.width = cols * this.pixelSize;
    this.element.height = this.element.width * (1 / aspect);

};

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

        var luminance = Halftone.Util.getRasterWidth(basedColor, base);

        if(Halftone.Options.invert){ luminance = 1 - luminance; }

        var rasterSize = luminance * ((pixelSize) / 2);

        var xOnCanvas = Math.floor(pixelSize / 2),
            yOnCanvas = xOnCanvas;

        context.beginPath();
        context.fillStyle = (Halftone.Options.invert) ? '#FFFFFF' : '#000000';
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

            var lastPixelIndex = -1;

            for (var p = 0; p < pixelIndexArray.length; p++) {

                var pixelIndex = pixelIndexArray[p];

                if(pixelIndex === 0){
                  pixelIndex = ++lastPixelIndex;
                }

                lastPixelIndex = pixelIndex;

                // decode pixelIndex (find row and col)
                row = Math.floor(pixelIndex / cols);
                col = pixelIndex % cols;

                if (row % 2 === 0) {
                    xOffset = pixelRadius;
                }

                var xOnCanvas = (col * pixelSize) + xOffset,
                    yOnCanvas = row * pixelSize;

                context.drawImage(sourcePixel, 0, 0, pixelSize, pixelSize, xOnCanvas, yOnCanvas, pixelSize, pixelSize);

                xOffset = 0;


            }

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

        var lastKnownColor = -1,
            lastKnownColorAdjusted = '#000';

        for(var r = 0; r < newMatrix.matrix.length; r++){

            var row = newMatrix.matrix[r];

            for(var c = 0; c < row.length; c++){

              var newPixel = Halftone.Util.brightenRgb(row[c], mul);

              if(oldMatrix && oldMatrix.matrix && oldMatrix.matrix[r] && oldMatrix.matrix[r][c]){

                // if there is an old matrix to compare to, find the matching pixel
                var oldPixel = Halftone.Util.brightenRgb(oldMatrix.matrix[r][c], mul);

                if(Halftone.Util.getCIE76(oldPixel, newPixel) < Halftone.Options.maxDeltaE){

                  // if the pixel color hasn't changed enough (based on deltaE), don't change it
                  currentPixelIndex++;

                  continue;

                }

              }

              // either old matrix doesn't exist or pixel color has shifted beyond deltaE tolerance

              var newPixelAdjusted = Halftone.Util.rgbToBase(newPixel, Halftone.Options.colorBase);

              if(!differenceMatrix[newPixelAdjusted]){
                differenceMatrix[newPixelAdjusted] = [];
              }

              if(newPixel === lastKnownColor){
              //if(Halftone.Util.getCIE76(newPixel, lastKnownColor) < Halftone.Options.maxDeltaE){

                // colors are encoded in streaks of 'similar enough' colored pixels
                differenceMatrix[lastKnownColorAdjusted].push(0);

              } else {

                // current pixel color is significantly different previous column
                differenceMatrix[newPixelAdjusted].push(currentPixelIndex);

                lastKnownColor = newPixel;
                lastKnownColorAdjusted = newPixelAdjusted;

              }

              currentPixelIndex++;

            }

        }

        return { metadata: newMatrix.metadata, matrix: differenceMatrix };

    }

};


Halftone.FileSource = function(srcPath){

    this.width = Halftone.Options.webcam.width;
    this.height = Halftone.Options.webcam.height;

    this.video = document.createElement('video');
    this.video.autoplay = true;

    // https://stackoverflow.com/questions/19251983/dynamically-create-a-html5-video-element-without-it-being-shown-in-the-page
    var sourceMP4 = document.createElement("source");
    sourceMP4.type = "video/mp4";
    sourceMP4.src = srcPath;
    this.video.appendChild(sourceMP4);

    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.canvas.width = this.width;
    this.canvas.height = this.height;

};

Halftone.FileSource.prototype = {

    errorCallback: function(e) {
        alert('Reeeejected!', e);
    },

    /**
     *
     * @param video
     * @param canvasContext
     * @returns {CanvasPixelArray}
     */

    getFrame: function(){

        this.context.drawImage(this.video, 0, 0, this.width, this.height);

        return this.context.getImageData(0, 0, this.width, this.height).data;

    }

};


Halftone.ImageSource = function(srcPath){

  this.width = Halftone.Options.webcam.width;
  this.height = Halftone.Options.webcam.height;

  this.canvas = document.createElement('canvas');
  this.context = this.canvas.getContext('2d');
  this.canvas.width = this.width;
  this.canvas.height = this.height;

  this.image = new Image();

  this.image.onload = function(){
    this.context.drawImage(this.image,0,0);
  }.bind(this);

  this.image.src = srcPath;

};

Halftone.ImageSource.prototype = {

    getFrame: function(){
        return this.context.getImageData(0, 0, this.width, this.height).data;
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

        ];

        return [avgColor[0], avgColor[1], avgColor[2]];

    },

    /**
     *
     * @param {CanvasPixelArray} canvasPixelArray
     * @param resolution
     * @returns {Array}
     */

    encodeFrame: function (canvasPixelArray, stagger){

        var width = Halftone.Options.webcam.width,
            height = Halftone.Options.webcam.height;

        var cols = Halftone.Options.quality,
            rows = (cols / width) * height;

        var sampleSize = width / cols,
            staggerWidth = sampleSize / 2;

        var matrix = [];

        for(var r = 0; r < rows; r++){

            var currentRow = [];

            var offsetWidth = (r % 2 === 0) ? sampleSize : staggerWidth;

            for(var c = 0; c < cols; c++){

                var xOnCanvas = Math.round((c * sampleSize) + offsetWidth),
                    yOnCanvas = Math.round((r * sampleSize) + staggerWidth);

                var colorAtPoint = this.getRgbAtPoint(xOnCanvas, yOnCanvas, sampleSize, width, canvasPixelArray);

                currentRow.push(colorAtPoint);

            }

            matrix.push(currentRow);

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

        };

    }

};


Halftone.WebcamSource = function(){

    this.width = Halftone.Options.webcam.width;
    this.height = Halftone.Options.webcam.height;

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
    getUserMedia(Halftone.Options.webcam, this.startVideo.bind(this), this.errorCallback, this.video);

};

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
            console.log(e);
        };

    },

    /**
     *
     * @param video
     * @param canvasContext
     * @returns {CanvasPixelArray}
     */

    getFrame: function(){

        this.context.drawImage(this.video, 0, 0, this.width, this.height);

        return this.context.getImageData(0, 0, this.width, this.height).data;

    }

};


}(this));
