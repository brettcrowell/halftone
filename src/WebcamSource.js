Halftone.WebcamSource = function(){

    this.options = {

        aspectRatio: 16 / 9,
        video: true,
        audio: false,
        width: 640

    };

    this.options.height = (1 / this.options.aspectRatio) * this.options.width;

    this.video = document.createElement('video');

    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.canvas.width = this.options.width;
    this.canvas.height = this.options.height;

    this.localMediaStream = null;

    if (!Halftone.Util.hasGetUserMedia()) {
        alert('getUserMedia() is not supported in your browser');
    }

    // http://www.html5rocks.com/en/tutorials/getusermedia/intro/

    // Not showing vendor prefixes.
    getUserMedia(this.options, this.startVideo.bind(this), this.errorCallback, this.video);

};

Halftone.WebcamSource.prototype = {

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
            console.log(e);
        };

    },

    /**
     *
     * @param video
     * @param canvasContext
     * @returns {CanvasPixelArray}
     */

    getFrame: function(){

        this.context.drawImage(this.video, 0, 0, this.options.width, this.options.height);

        return this.context.getImageData(0, 0, this.options.width, this.options.height).data;

    }

};
