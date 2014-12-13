Bullet.WebcamSource = function(document){

    this.video = document.createElement('video');
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d')
    this.localMediaStream = null;

    if (!Bullet.Util.hasGetUserMedia()) {
        alert('getUserMedia() is not supported in your browser');
    }

    // http://www.html5rocks.com/en/tutorials/getusermedia/intro/

    // Not showing vendor prefixes.
    navigator.webkitGetUserMedia(Bullet.Options.videoConstraints, this.startVideo.bind(this), this.errorCallback);

    return this.video;

}

Bullet.WebcamSource.prototype = {

    errorCallback: function(e) {
        alert('Reeeejected!', e);
    },

    startVideo: function(stream) {

        this.localMediaStream = stream;

        this.video.autoplay = true;
        this.video.src = window.URL.createObjectURL(this.localMediaStream);

        // Note: onloadedmetadata doesn't fire in Chrome when using it with getUserMedia.
        // See crbug.com/110938.
        this.video.onloadedmetadata = function(e) {
            // Ready to go. Do some stuff.
        };

    },

    /**
     *
     * @param video
     * @param canvasContext
     * @returns {CanvasPixelArray}
     */

    getFrame: function(video, canvasContext){

        var width = Bullet.Options.imageWidth,
            height = Bullet.Options.imageHeight;

        this.context.drawImage(this.video, 0, 0);

        return this.context.getImageData(0, 0, width, height).data;

    }

}