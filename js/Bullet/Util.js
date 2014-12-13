Bullet.Util = {

    // http://www.html5canvastutorials.com/advanced/html5-canvas-load-image-data-url/
    // http://stackoverflow.com/questions/6735470/get-pixel-color-from-canvas-on-mouseover
    rgbToHex: function(r, g, b) {
        if (r > 255 || g > 255 || b > 255)
            throw "Invalid color component";
        return ((r << 16) | (g << 8) | b).toString(16);
    },

    hexToBw: function (hex){

        var rgb = hexToRgb(hex);

        return (rgb.r + rgb.b + rgb.g) / 3;

    },

    hexToRgb: function (hex){

        hex = hex.substr(1);

        return {

            r: parseInt(hex[0], 16),
            g: parseInt(hex[1], 16),
            b: parseInt(hex[2], 16)

        }

    },

    calculateSimilarity: function (n1,n2){

        var max = Math.max(n1,n2),
            min = Math.min(n1,n2);

        var similarity = min / max;

        return similarity;

    },

    getMinSimilarity: function (hex1, hex2){

        var dec1 = hexToRgb(hex1),
            dec2 = hexToRgb(hex2);

        var similarities = [

            calculateSimilarity(dec1.r, dec2.r),
            calculateSimilarity(dec1.g, dec2.g),
            calculateSimilarity(dec1.b, dec2.b)

        ]

        return _.min(similarities);


    },

    hasGetUserMedia: function() {
        return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia || navigator.msGetUserMedia);
    }

}