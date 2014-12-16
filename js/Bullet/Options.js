Bullet.Options = {

    viewportId: 'viewport',
    svgId: 'display',
    sourceCanvasId: 'imgSource',
    svgNamespace: "http://www.w3.org/2000/svg",
    testImage: './img/test-image.jpg',
    quality: 120,
    stagger: true,
    minPixelSimilarity: 0.95,
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