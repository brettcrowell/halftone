var options = {

  viewportId: 'viewport',
  sourceCanvasId: 'imgSource',
  testImage: './img/test-image.jpg',
  imageWidth: 640,
  imageHeight: 480,
  resolution: 0.2,
  pixelChar: '•',
  backgroundColor: '#000'

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

function buildHexMatrix(imageWidth, imageHeight, resolution, context){

  var matrixStart = new Date().getTime();

  var matrix = [];

  var rows = imageHeight * resolution,
      cols = imageWidth * resolution;

  for(var r = 0; r < rows; r++){

    var currentRow = [];

    for(var c = 0; c < cols; c++){

      var xOnCanvas = c * (1 / resolution),
          yOnCanvas = r * (1 / resolution);

      var colorAtPoint = getHexAtPoint(xOnCanvas, yOnCanvas, context);

      currentRow.push(colorAtPoint);

    }

    matrix.push(currentRow)

  }

  var matrixEnd = new Date().getTime();

  console.log("Matrix generation time: " + (matrixEnd - matrixStart));

  return matrix;

}


$(document).ready(function(){

  var canvas = document.getElementById(options.sourceCanvasId),
      context = canvas.getContext('2d');

  // load image from data url
  var imageObj = new Image();
  imageObj.onload = function() {

    context.drawImage(this, 0, 0);

    var hexMatrix = buildHexMatrix(options.imageWidth, options.imageHeight, options.resolution, context);

    var viewport = $('#' + options.viewportId);

    var svg = Snap(options.imageWidth, options.imageHeight);

    viewport.append(svg);

    var pixelWidth = 1 / options.resolution,
        pixelRadius = pixelWidth / 2;

    var renderStart = new Date().getTime();

    _.each(hexMatrix, function(row, r){

      _.each(row, function(pixelColor, c){

        var xOnCanvas = (c * pixelWidth) + pixelRadius,
            yOnCanvas = (r * pixelWidth) + pixelRadius;

        var pixel = svg.circle();

        pixel.attr({

          'cx': xOnCanvas,
          'cy': yOnCanvas,
          'r': pixelRadius,
          'fill': pixelColor

        });

      });

      viewport.append('<br/>');

    });

    var renderEnd = new Date().getTime();

    console.log("Render time: " + (renderEnd - renderStart));



  };

  imageObj.src = options.testImage;

});
