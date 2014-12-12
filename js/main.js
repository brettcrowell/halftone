var options = {

  viewportId: 'viewport',
  svgId: 'display',
  sourceCanvasId: 'imgSource',
  svgNamespace: "http://www.w3.org/2000/svg",
  testImage: './img/test-image.jpg',
  imageWidth: 640,
  imageHeight: 480,
  resolution: 0.15,
  minPixelSimilarity: 0.75,
  frameRate: 8,
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

function hexToBw(hex){

  var rgb = hexToRgb(hex);

  return (rgb.r + rgb.b + rgb.g) / 3;

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

  //console.log("Matrix generation time: " + (matrixEnd - matrixStart));

  // store this matrix in the cache for comparison
  cache.currentMatrix = matrix;

  return matrix;

}

function hexToRgb(hex){

  hex = hex.substr(1);

  return {

    r: parseInt(hex[0], 16),
    g: parseInt(hex[1], 16),
    b: parseInt(hex[2], 16)

  }

}

function calculateSimilarity(n1,n2){

  var max = Math.max(n1,n2),
      min = Math.min(n1,n2);

  var similarity = min / max;

  return similarity;

}

function getMinSimilarity(hex1, hex2){

  var dec1 = hexToRgb(hex1),
      dec2 = hexToRgb(hex2);

  var similarities = [

    calculateSimilarity(dec1.r, dec2.r),
    calculateSimilarity(dec1.g, dec2.g),
    calculateSimilarity(dec1.b, dec2.b)

  ]

  return _.min(similarities);


}

function getDifferenceMatrix(oldMatrix, newMatrix){

  var totalPixelsSeen = 0,
      numChangedPixels = 0;

  var matrixStart = new Date().getTime();

  var differenceMatrix = [];

  _.each(newMatrix, function(row, r){

    var differenceRow = [];

    _.each(row, function(newPixel, c){

      var oldPixel = oldMatrix[r][c],
          similarity = getMinSimilarity(oldPixel, newPixel);

      if(similarity > options.minPixelSimilarity){

        // new pixel color is 'similar enough' to old to omit
        differenceRow.push(null);

      } else {

        // new pixel color is significantly different from old
        differenceRow.push(newPixel);
        numChangedPixels++;

      }

      totalPixelsSeen++;

    });

    differenceMatrix.push(differenceRow);

  });

  var matrixEnd = new Date().getTime();
  //console.log("Difference matrix generation time: " + (matrixEnd - matrixStart));
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

  //var addSvgToViewport = removeToInsertLater(svg);

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

          svg.appendChild(pixel);

          virtualDOM[r].push(pixel);

        }

        // set pixel color
        pixel.setAttributeNS(null, "fill", pixelColor);

        // rasterbating the pixels (changing diameter based on shade)
        pixel.setAttributeNS(null, "r", (pixelRadius * ((15 - hexToBw(pixelColor)) / 15)));


      }

    });

  });

  var renderEnd = new Date().getTime();

  //addSvgToViewport();

  //console.log("Render time: " + (renderEnd - renderStart));

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

  renderMatrixToSvg(hexMatrix, svg, options.resolution);

  function hasGetUserMedia() {
    return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia || navigator.msGetUserMedia);
  }

  if (hasGetUserMedia()) {
    // Good to go!
  } else {
    alert('getUserMedia() is not supported in your browser');
  }

  // http://www.html5rocks.com/en/tutorials/getusermedia/intro/
  var video = document.querySelector('video'),
      localMediaStream = null;

  var errorCallback = function(e) {
    console.log('Reeeejected!', e);
  };

  var vgaConstraints = {
    video: {
      mandatory: {
        maxWidth: 640,
        maxHeight: 480
      }
    }
  };

  function drawVideoToCanvas(video, canvasContext){

    canvasContext.drawImage(video, 0, 0);

    var oldHexMatrix = cache.currentMatrix;

    hexMatrix = buildHexMatrix(canvas, options.resolution);

    var differenceMatrix = getDifferenceMatrix(oldHexMatrix, hexMatrix);

    renderMatrixToSvg(differenceMatrix, svg, options.resolution);

  }

  function startVideo(stream) {

    var frameInterval = 1 / (options.frameRate / 1000);

    localMediaStream = stream;

    var video = document.querySelector('video');
    video.src = window.URL.createObjectURL(localMediaStream);

    setInterval(function(){
      drawVideoToCanvas(video, context);
    }, frameInterval);

    // Note: onloadedmetadata doesn't fire in Chrome when using it with getUserMedia.
    // See crbug.com/110938.
    video.onloadedmetadata = function(e) {
      // Ready to go. Do some stuff.
    };

  }

  // Not showing vendor prefixes.
  navigator.webkitGetUserMedia(vgaConstraints, startVideo, errorCallback);


  /*

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
  */

});
