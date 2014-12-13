// source (video, image on canvas)
// frame encoder (inp: canvas, encodes in fps, event when frame ready)
// client/decoder (displays hex matrix... svg, canvas, webgl?)
// memoize everything!!!!!
// base36
// calculate similarity based on grayscale

// max frame rate = 1 / ((21+19)/1000)

// source --> encode --> compress --> decompress/render/display

Bullet = {};

var cache = {

  virtualDOM: [],
  currentMatrix: [],
  maxLumens: 0,
  minLumens: 15

}


$(document).ready(function(){

  //var svg = document.getElementById(Bullet.Options.svgId);

  var source = new Bullet.WebcamSource();
      encoder = new Bullet.RasterFrameEncoder(),
      render = new Bullet.PixiRenderer();

  document.getElementById('viewport').appendChild(render.getElement());

  var frameInterval = 1 / (Bullet.Options.frameRate / 1000),
      resolution = Bullet.Options.resolution;

  var lastKnownFrame = null;

  setInterval(
      function(){

        var currentFrame = encoder.encodeFrame(source.getFrame(), resolution);

        var differenceMatrix = (lastKnownFrame === null) ? currentFrame : Bullet.Util.getDifferenceMatrix(lastKnownFrame, currentFrame);

        render.render(differenceMatrix, resolution);
        lastKnownFrame = currentFrame;
      },
      frameInterval
  )


});
