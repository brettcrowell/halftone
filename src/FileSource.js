Halftone.FileSource = function(srcPath){

    this.width = Halftone.Options.webcam.width;
    this.height = Halftone.Options.webcam.height;

    this.video = document.createElement('video');
    this.video.autoplay = true;

    // https://stackoverflow.com/questions/19251983/dynamically-create-a-html5-video-element-without-it-being-shown-in-the-page
    var sourceMP4 = document.createElement("source");
    sourceMP4.type = "video/mp4";
    sourceMP4.src = srcPath;
    this.video.appendChild(sourceMP4);

    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.canvas.width = this.width;
    this.canvas.height = this.height;

};

Halftone.FileSource.prototype = {

    errorCallback: function(e) {
        alert('Reeeejected!', e);
    },

    /**
     *
     * @param video
     * @param canvasContext
     * @returns {CanvasPixelArray}
     */

    getFrame: function(){

        this.context.drawImage(this.video, 0, 0, this.width, this.height);

        return this.context.getImageData(0, 0, this.width, this.height).data;

    }

};
