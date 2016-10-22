export default class WebcamSource {

  constructor() {

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

    // http://www.html5rocks.com/en/tutorials/getusermedia/intro/

    var constraints = { audio: false, video: { width: 1280, height: 720 } };

    navigator.mediaDevices.getUserMedia(constraints)
      .then(this.startVideo.bind(this))
      .catch(this.errorCallback);

  }

  errorCallback(e) {
    console.log('Reeeejected!', e);
  }

  startVideo(stream) {

    this.localMediaStream = stream;

    this.video.autoplay = true;
    this.video.src = window.URL.createObjectURL(this.localMediaStream);

    // Note: onloadedmetadata doesn't fire in Chrome when using it with getUserMedia.
    // See crbug.com/110938.
    this.video.onloadedmetadata = function (e) {
      console.log(e); //@todo do something with metadata
    };

  }

  /**
   * "Sample" the webcam stream by grabbing the next frame and freezing it onto our canvas.
   * Once we have it, return the raw image data.
   *
   * @param video
   * @param canvasContext
   * @returns {CanvasPixelArray}
   */

  getFrame() {
    this.context.drawImage(this.video, 0, 0, this.options.width, this.options.height);
    return this.context.getImageData(0, 0, this.options.width, this.options.height).data;
  }

}