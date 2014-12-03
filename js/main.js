var options = {

  viewportId: 'viewport',
  sourceCanvasId: 'imgSource',
  testImage: './img/test-image.jpg',
  imageWidth: 640,
  imageHeight: 480,
  resolution: 0.25,
  pixelChar: '•'

}

// http://www.html5canvastutorials.com/advanced/html5-canvas-load-image-data-url/
// http://stackoverflow.com/questions/6735470/get-pixel-color-from-canvas-on-mouseover
function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}

function getHexAtPoint(x, y, ctx){

  var p = ctx.getImageData(x, y, 1, 1).data,
      hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);

  return hex;

}


$(document).ready(function(){

  var canvas = document.getElementById(options.sourceCanvasId),
      context = canvas.getContext('2d');

  // load image from data url
  var imageObj = new Image();
  imageObj.onload = function() {

    context.drawImage(this, 0, 0);

    var viewport = $('#' + options.viewportId),
        rows = options.imageHeight * options.resolution,
        cols = options.imageWidth * options.resolution;

    for(var r = 0; r < rows; r++){

      for(var c = 0; c < cols; c++){

        var xOnCanvas = c * (1 / options.resolution),
            yOnCanvas = r * (1 / options.resolution);

        var colorAtPoint = getHexAtPoint(xOnCanvas, yOnCanvas, context);

        viewport.append("<span style='color:" + colorAtPoint + "'>" + options.pixelChar + "</span>");

      }

      viewport.append("<br/>");

    }

  };

  imageObj.src = options.testImage;

});
