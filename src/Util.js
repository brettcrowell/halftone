Halftone.Util = {

    // http://www.html5canvastutorials.com/advanced/html5-canvas-load-image-data-url/
    // http://stackoverflow.com/questions/6735470/get-pixel-color-from-canvas-on-mouseover
    rgbToHex: function(rgb) {

        var r = rgb[0],
            g = rgb[1],
            b = rgb[2];

        if (r > 255 || g > 255 || b > 255) {
          throw "Invalid color component";
        }

        var hex = "000000" + ((r << 16) | (g << 8) | b).toString(16);

        return "#" + hex.substr(-6);

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

        hex = ("000000" + Halftone.Util.rgbToHex([r,g,b]).substr(1)).slice(-6);

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
            hex = ("000000" + this.rgbToHex(rgb).substr(1)).slice(-6);

        return "#" + hex[0] + hex[2] + hex[4];

    },

    getRgbLuminance: function(rgb, precision){

        var hsv = this.rgbToHsv(rgb);

        return parseInt(hsv[2] * precision, 10) / precision;

    },

    rgbToGrayscale: function(rgb){

        // http://bobpowell.net/grayscale.aspx

        var g = (rgb[0] *0.3) + (rgb[1] *0.59) + (rgb[2] *0.11);

        return [g,g,g];

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

    rgbEquals: function(rgb1, rgb2) {

      return rgb1[0] === rgb2[0] && rgb1[1] === rgb2[1] && rgb1[2] === rgb2[2];

    },

    getCIE76: function(rgb1, rgb2){

      if(this.rgbEquals(rgb1, rgb2)){
        return 0;
      }

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
