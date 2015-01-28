Halftone.Options = {

    viewportId: 'viewport',
    svgId: 'display',
    sourceCanvasId: 'imgSource',
    svgNamespace: "http://www.w3.org/2000/svg",
    testImage: './img/test-image.jpg',
    quality: 150,
    pixelSize: 10,
    aspectRatio: 16 / 9,
    colorMultiplier: 3,
    colorBase: 16, // max 36
    stagger: true,
    maxPctRgbDifference: 0.02,
    maxDeltaE: 10,
    frameRate: 10,
    backgroundColor: '#eee',
    webcam: {
      video: true,
      audio: false,
      width: 320,
      height: 240
    }

};
