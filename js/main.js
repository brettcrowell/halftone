var options = {

  viewportId: 'viewport',
  imageWidth: 640,
  imageHeight: 480,
  resolution: 0.25,
  pixelChar: '•'

}

$(document).ready(function(){

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
