Bullet.Options = {

    viewportId: 'viewport',
    svgId: 'display',
    sourceCanvasId: 'imgSource',
    svgNamespace: "http://www.w3.org/2000/svg",
    testImage: './img/test-image.jpg',
    resolution: 0.1,
    minPixelSimilarity: 0.85,
    frameRate: 12,
    backgroundColor: '#eee',
    videoConstraints: {
        video: {
            optional: [{sourceId: 'c7a89a8cfbf6bb4aa502573afa3f524ae8dd6af83c189bd94529990522adc454'}],
            mandatory: {
                maxWidth: 640,
                maxHeight: 480
            }
        }
    }

}