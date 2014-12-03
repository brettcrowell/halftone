var options = {

  viewportId: 'viewport',
  sourceCanvasId: 'imgSource',
  imageWidth: 640,
  imageHeight: 480,
  resolution: 0.25,
  pixelChar: '•'

}

function loadCanvas(dataURL) {
  var canvas = document.getElementById(options.sourceCanvasId);
  var context = canvas.getContext('2d');

  // load image from data url
  var imageObj = new Image();
  imageObj.onload = function() {
    context.drawImage(this, 0, 0);
  };

  imageObj.src = dataURL;
}

$(document).ready(function(){

  loadCanvas("./img/test-image.jpg")

  var viewport = $('#' + options.viewportId),
      rows = options.imageHeight * options.resolution,
      cols = options.imageWidth * options.resolution;

  for(var r = 0; r < rows; r++){

    for(var c = 0; c < cols; c++){

      viewport.append(options.pixelChar);

    }

    viewport.append("<br/>");

  }

});
