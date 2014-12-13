// source (video, image on canvas)
// frame encoder (inp: canvas, encodes in fps, event when frame ready)
// client/decoder (displays hex matrix... svg, canvas, webgl?)
// memoize everything!!!!!
// base36
// calculate similarity based on grayscale

// max frame rate = 1 / ((21+19)/1000)

Bullet = {};

var cache = {

  virtualDOM: [],
  currentMatrix: [],
  maxLumens: 0,
  minLumens: 15

}


$(document).ready(function(){

  //var svg = document.getElementById(Bullet.Options.svgId);

  var source = new Bullet.WebcamSource(document);
      //encoder = new Bullet.RasterEncoder();

  document.body.appendChild(source);

  //new Bullet.SvgViewer(source, svg, encoder);


});
