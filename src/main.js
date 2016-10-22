import WebcamSource from "./sources/WebcamSource";
import RasterFrameEncoder from "./encoders/RasterFrameEncoder";
import Compressor from "./compressors/Compressor";
import CachedCanvasRenderer from "./renderers/CachedCanvasRenderer";

// max frame rate = 1 / ((21+19)/1000)
// source --> encode --> compress --> decompress/renderer/display

const source = new WebcamSource();
const encoder = new RasterFrameEncoder();
const compressor = new Compressor();
const renderer = new CachedCanvasRenderer();

document.getElementById('viewport').appendChild(renderer.getElement());

const frameRate = 10;
const frameInterval = 1 / (frameRate / 1000);

var lastKnownFrame = null;

function updateFrame(){

  var imageData = source.getFrame();
  var currentFrame = encoder.encodeFrame(imageData, true);
  var differenceMatrix = compressor.getDifferenceMatrix(lastKnownFrame, currentFrame);

  renderer.render(differenceMatrix);

  lastKnownFrame = currentFrame;

}

setInterval(updateFrame, frameInterval);