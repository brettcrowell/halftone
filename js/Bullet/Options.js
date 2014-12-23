Bullet.Options = {

    viewportId: 'viewport',
    svgId: 'display',
    sourceCanvasId: 'imgSource',
    svgNamespace: "http://www.w3.org/2000/svg",
    testImage: './img/test-image.jpg',
    quality: 120,
    colorMultiplier: 1.75,
    colorBase: 20, // max 36
    stagger: true,
    maxPctRgbDifference: 0.05,
    frameRate: 7,
    backgroundColor: '#eee',
    videoConstraints: {
        video: {
            mandatory: {
                maxWidth: 320,
                maxHeight: 240
            }
        }
    }

}