Halftone.Options = {

    viewportId: 'viewport',
    svgId: 'display',
    sourceCanvasId: 'imgSource',
    svgNamespace: "http://www.w3.org/2000/svg",
    testImage: './img/test-image.jpg',
    quality: 200,
    pixelSize: 10,
    aspectRatio: 4 / 3,
    colorMultiplier: 1.5,
    colorBase: 10, // max 36
    stagger: true,
    maxPctRgbDifference: 0.02,
    frameRate: 7,
    backgroundColor: '#eee',
    webcam: {
      video: true,
      audio: false,
      width: 320,
      height: 240
    }

};
