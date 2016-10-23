import WebcamSource from "./sources/WebcamSource";
import BinaryFrameEncoder from "./encoders/BinaryFrameEncoder";
import BinaryCompressor from "./compressors/BinaryCompressor";
import BinaryCachedCanvasRenderer from "./renderers/BinaryCachedCanvasRenderer";

// max frame rate = 1 / ((21+19)/1000)
// source --> encode --> compress --> decompress/renderer/display

const source = new WebcamSource();
const encoder = new BinaryFrameEncoder();
const compressor = new BinaryCompressor();
const renderer = new BinaryCachedCanvasRenderer();

document.getElementById("redrawFrame").onclick = updateFrame;
document.getElementById("updateFrame").onclick = () => console.log(lastFrameSeen);
document.getElementById("updateDiff").onclick = () => console.log(lastDiffSeen);
document.getElementById('viewport').appendChild(renderer.getElement());

const frameRate = 10;
const frameInterval = 1 / (frameRate / 1000);

let lastFrameSeen = null;
let lastDiffSeen = null;

function updateFrame(){

  var imageData = source.getFrame();
  var currentFrame = encoder.encodeFrame(imageData, true);
  var difference = compressor.getDifferenceMatrix(lastFrameSeen, currentFrame);

  lastFrameSeen = currentFrame;
  lastDiffSeen = difference;

  renderer.render(difference);

}

setInterval(updateFrame, frameInterval);