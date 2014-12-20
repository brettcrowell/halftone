Bullet.Options = {

    viewportId: 'viewport',
    svgId: 'display',
    sourceCanvasId: 'imgSource',
    svgNamespace: "http://www.w3.org/2000/svg",
    testImage: './img/test-image.jpg',
    quality: 110,
    colorMultiplier: 1.7,
    stagger: true,
    brightnessSimilarity: 0.06,
    hueSimilarity: 0.06,
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