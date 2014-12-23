Bullet.Util = {

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

    getRasterWidth: function(colorBase36, colorBase){

        var rgb = this.base36toRgb(colorBase36, colorBase),
            hsv = this.rgbToHsv(rgb);

        return hsv[2];

    },

    brightenHexColor: _.memoize(function(hex, mul){

        var rgb = this.hexToRgb(hex);

        var r = Math.min(rgb.r * mul, 255),
            g = Math.min(rgb.g * mul, 255),
            b = Math.min(rgb.b * mul, 255);

        hex = ("000000" + Bullet.Util.rgbToHex(r,g,b)).slice(-6);

        return "#" + hex[0] + hex[2] + hex[4];

    }),

    rgbToGrayscale: function (rgb){

        // http://bobpowell.net/grayscale.aspx

        return (rgb[0] *.3) + (rgb[1] *.59) + (rgb[2] *.11);

    },

    hexToRgb: _.memoize(function (hex){

        hex = hex.substr(1);

        return {

            r: parseInt(hex[0] + hex[0], 16),
            g: parseInt(hex[1] + hex[1], 16),
            b: parseInt(hex[2] + hex[2], 16)

        }

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

    rgbToBase36: function(rgb, base){

        var range = base - 1;

        var r = Math.round((rgb[0]/255) * range).toString(base),
            g = Math.round((rgb[1]/255) * range).toString(base),
            b = Math.round((rgb[2]/255) * range).toString(base);

        return r + g + b;

    },

    base36toRgb: function(base36, base){

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