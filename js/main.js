var options = {

  viewportId: 'viewport',
  sourceCanvasId: 'imgSource',
  testImage: './img/test-image.jpg',
  imageWidth: 640,
  imageHeight: 480,
  resolution: 0.01,
  backgroundColor: '#000'

}

var virtualDOM = [];

// http://www.html5canvastutorials.com/advanced/html5-canvas-load-image-data-url/
// http://stackoverflow.com/questions/6735470/get-pixel-color-from-canvas-on-mouseover
function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}

// http://stackoverflow.com/questions/667045/getpixel-from-html-canvas
// http://msdn.microsoft.com/en-us/library/ie/ff974957%28v=vs.85%29.aspx
function getHexAtPoint(x, y, totalWidth, ctxImageData, shorthand){

  var dataIndex = (y * totalWidth + x) * 4;

  var r = ctxImageData[dataIndex],
      g = ctxImageData[dataIndex+1],
      b = ctxImageData[dataIndex+2],
      a = ctxImageData[dataIndex+3];

  hex = ("000000" + rgbToHex(r, g, b)).slice(-6);

  if(!shorthand){
    return "#" + hex;
  }

  return "#" + hex[0] + hex[2] + hex[4];

}

function buildHexMatrix(canvas, resolution){

  var matrixStart = new Date().getTime();

  var width = canvas.width,
      height = canvas.height;

  var context = canvas.getContext('2d'),
      ctxImageData = context.getImageData(0, 0, width, height).data;

  var matrix = [];

  var rows = height * resolution,
      cols = width * resolution;

  for(var r = 0; r < rows; r++){

    var currentRow = [];

    for(var c = 0; c < cols; c++){

      var xOnCanvas = Math.round(c * (1 / resolution)),
          yOnCanvas = Math.round(r * (1 / resolution));

      var colorAtPoint = getHexAtPoint(xOnCanvas, yOnCanvas, width, ctxImageData, true);

      currentRow.push(colorAtPoint);

    }

    matrix.push(currentRow)

  }

  var matrixEnd = new Date().getTime();

  console.log("Matrix generation time: " + (matrixEnd - matrixStart));

  return matrix;

}

function renderCanvasToSvg(canvas, resolution){

  var hexMatrix = buildHexMatrix(canvas, resolution);

  var svg = Snap('#display');

  var pixelWidth = 1 / resolution,
      pixelRadius = pixelWidth / 2;

  var renderStart = new Date().getTime();

  _.each(hexMatrix, function(row, r){

    if(!virtualDOM[r]){ virtualDOM.push([]); }

    _.each(row, function(pixelColor, c){

      //console.log('row: ' + r)

      var xOnCanvas = (c * pixelWidth) + pixelRadius,
          yOnCanvas = (r * pixelWidth) + pixelRadius;

      var cachedDomNode = virtualDOM[r][c];

      if(cachedDomNode){

        var pixel = virtualDOM[r][c];

      } else {

        var pixel = svg.circle();

        pixel.attr({

          'cx': xOnCanvas,
          'cy': yOnCanvas,
          'r': pixelRadius

        });

        virtualDOM[r].push(pixel);

      }

      pixel.attr('fill', pixelColor);

    });

  });

  var renderEnd = new Date().getTime();

  console.log("Render time: " + (renderEnd - renderStart));

  return svg;

}


$(document).ready(function(){

  var canvas = document.getElementById(options.sourceCanvasId),
      context = canvas.getContext('2d');

  var viewport = $('div#' + options.viewportId);

  viewport.css({

    width: canvas.width + 'px',
    height: canvas.height + 'px',
    'background-color': options.backgroundColor

  });

  renderCanvasToSvg(canvas, options.resolution)

  // load image from data url
  var imageObj = new Image();
  imageObj.onload = function() {

    context.drawImage(this, 0, 0);

    renderCanvasToSvg(canvas, options.resolution)

  };

  imageObj.src = options.testImage;

});
