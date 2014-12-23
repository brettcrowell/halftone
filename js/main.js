// source (video, image on canvas)
// frame encoder (inp: canvas, encodes in fps, event when frame ready)
// client/decoder (displays hex matrix... svg, canvas, webgl?)
// memoize everything!!!!!
// base36
// calculate similarity based on grayscale
// offset encoding
// compressor

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
      compressor = new Bullet.Compressor(),
      render = new Bullet.CachedCanvasRenderer();

  document.getElementById('viewport').appendChild(render.getElement());

  var frameInterval = 1 / (Bullet.Options.frameRate / 1000),
      resolution = Bullet.Options.resolution;

  var lastKnownFrame = null;

  var metrics = {
    renderTimes: [],
    totalTimes: [],
    imageTimes: [],
    encodeTimes: [],
    compressTimes: []
  };

  function displayMetrics(renderTime, totalTime, imageTime, encodeTime, compressTime){

    metrics.totalTimes.push(totalTime);
    var averageTime = Bullet.Util.average(metrics.totalTimes);

    metrics.renderTimes.push(renderTime);
    var averageRenderTime = Bullet.Util.average(metrics.renderTimes);

    metrics.imageTimes.push(imageTime);
    var averageImageTime = Bullet.Util.average(metrics.imageTimes);

    metrics.encodeTimes.push(encodeTime);
    var averageEncodeTime = Bullet.Util.average(metrics.encodeTimes);

    metrics.compressTimes.push(compressTime);
    var averageCompressTime = Bullet.Util.average(metrics.compressTimes);

    document.getElementById('total').textContent = parseInt(averageTime);
    document.getElementById('render').textContent = parseInt(averageRenderTime);
    document.getElementById('fps').textContent = parseInt(1000 / averageTime);
    document.getElementById('nonrender').textContent = parseInt(averageTime - averageRenderTime);
    document.getElementById('image').textContent = parseInt(averageImageTime);
    document.getElementById('encode').textContent = parseInt(averageEncodeTime);
    document.getElementById('compress').textContent = parseInt(averageCompressTime);


  }

  function updateFrame(){

    var totalBegin = new Date().getTime();

          var imageBegin = new Date().getTime();
    var imageData = source.getFrame();
          var imageTime = new Date().getTime() - imageBegin;

          var frameBegin = new Date().getTime();
    var currentFrame = encoder.encodeFrame(imageData, Bullet.Options.stagger);
          var frameTime = new Date().getTime() - frameBegin;

          var compressBegin = new Date().getTime();
    var differenceMatrix = (lastKnownFrame === null) ? currentFrame : compressor.getDifferenceMatrix(lastKnownFrame, currentFrame);
          var compressTime = new Date().getTime() - compressBegin;

    var renderBegin = new Date().getTime();

    render.render(differenceMatrix);

    var renderTime = new Date().getTime() - renderBegin,
        totalTime = new Date().getTime() - totalBegin;

    //displayMetrics(renderTime, totalTime, imageTime, frameTime, compressTime);

    lastKnownFrame = currentFrame;

  }

  setInterval(updateFrame, frameInterval)


});
