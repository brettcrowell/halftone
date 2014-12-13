Bullet.Options = {

    viewportId: 'viewport',
    svgId: 'display',
    sourceCanvasId: 'imgSource',
    svgNamespace: "http://www.w3.org/2000/svg",
    testImage: './img/test-image.jpg',
    imageWidth: 640,
    imageHeight: 480,
    resolution: 0.3,
    minPixelSimilarity: 0.85,
    frameRate: 7,
    backgroundColor: '#eee',
    videoConstraints: {
        video: {
            mandatory: {
                maxWidth: 640,
                maxHeight: 480
            }
        }
    }

}