var options = {

  viewportId: 'viewport',
  svgId: 'display',
  sourceCanvasId: 'imgSource',
  svgNamespace: "http://www.w3.org/2000/svg",
  testImage: './img/test-image.jpg',
  imageWidth: 640,
  imageHeight: 480,
  resolution: 0.17,
  backgroundColor: '#000'

}

// max frame rate = 1 / ((21+19)/1000)

var cache = {

  virtualDOM: [],
  currentMatrix: []

}

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
      b = ctxImageData[dataIndex+2];

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

  // store this matrix in the cache for comparison
  cache.currentMatrix = matrix;

  return matrix;

}

function getDifferenceMatrix(oldMatrix, newMatrix){

  var totalPixelsSeen = 0,
      numChangedPixels = 0;

  var matrixStart = new Date().getTime();

  var differenceMatrix = [];

  _.each(newMatrix, function(row, r){

    var differenceRow = [];

    _.each(row, function(newPixel, c){

      if(newPixel == oldMatrix[r][c]){
        differenceRow.push(null);
      } else {
        differenceRow.push(newPixel);
        numChangedPixels++;
      }

      totalPixelsSeen++;

    });

    differenceMatrix.push(differenceRow);

  });

  var matrixEnd = new Date().getTime();
  console.log("Pixels changed: " + ((numChangedPixels / totalPixelsSeen) * 100) + "%");

  return differenceMatrix;

}

/**
 * Remove an element and provide a function that inserts it into its original position
 * https://developers.google.com/speed/articles/javascript-dom
 *
 * @param element {Element} The element to be temporarily removed
 * @return {Function} A function that inserts the element into its original position
 **/
function removeToInsertLater(element) {
  var parentNode = element.parentNode;
  var nextSibling = element.nextSibling;
  parentNode.removeChild(element);
  return function() {
    if (nextSibling) {
      parentNode.insertBefore(element, nextSibling);
    } else {
      parentNode.appendChild(element);
    }
  };
}

function renderMatrixToSvg(hexMatrix, svg, resolution){

  var addSvgToViewport = removeToInsertLater(svg);

  var virtualDOM = cache.virtualDOM;

  var pixelWidth = 1 / resolution,
      pixelRadius = pixelWidth / 2;

  var renderStart = new Date().getTime();

  _.each(hexMatrix, function(row, r){

    if(!virtualDOM[r]){ virtualDOM.push([]); }

    _.each(row, function(pixelColor, c){

      if(pixelColor !== null){

        var xOnCanvas = (c * pixelWidth) + pixelRadius,
            yOnCanvas = (r * pixelWidth) + pixelRadius;

        var cachedDomNode = virtualDOM[r][c];

        if(cachedDomNode){

          var pixel = virtualDOM[r][c];

        } else {

          var pixel = document.createElementNS(options.svgNamespace,"circle");

          pixel.setAttributeNS(null, "cx", xOnCanvas);
          pixel.setAttributeNS(null, "cy", yOnCanvas);
          pixel.setAttributeNS(null, "r", pixelRadius);

          svg.appendChild(pixel);

          virtualDOM[r].push(pixel);

        }

        pixel.setAttributeNS(null, "fill", pixelColor);

      }

    });

  });

  var renderEnd = new Date().getTime();

  addSvgToViewport();

  console.log("Render time: " + (renderEnd - renderStart));

}


$(document).ready(function(){

  var svg = document.getElementById(options.svgId),
      canvas = document.getElementById(options.sourceCanvasId),
      context = canvas.getContext('2d');

  var viewport = $('div#' + options.viewportId);

  viewport.css({

    width: canvas.width + 'px',
    height: canvas.height + 'px',
    'background-color': options.backgroundColor

  });

  /////////

  var hexMatrix = buildHexMatrix(canvas, options.resolution);

  renderMatrixToSvg(hexMatrix, svg, options.resolution)

  // load image from data url
  var imageObj = new Image();
  imageObj.onload = function() {

    context.drawImage(this, 0, 0);

    hexMatrix = buildHexMatrix(canvas, options.resolution);

    renderMatrixToSvg(hexMatrix, svg, options.resolution);

    hexMatrix = buildHexMatrix(canvas, options.resolution);

    var differenceMatrix = getDifferenceMatrix(cache.currentMatrix, hexMatrix);

    renderMatrixToSvg(differenceMatrix, svg, options.resolution);

  };

  imageObj.src = options.testImage;

});
