Halftone.ImageSource = function(srcPath){

  this.width = Halftone.Options.webcam.width;
  this.height = Halftone.Options.webcam.height;

  this.canvas = document.createElement('canvas');
  this.context = this.canvas.getContext('2d');
  this.canvas.width = this.width;
  this.canvas.height = this.height;

  this.image = new Image();

  this.image.onload = function(){
    this.context.drawImage(this.image,0,0);
  }.bind(this);

  this.image.src = srcPath;

};

Halftone.ImageSource.prototype = {

    getFrame: function(){
        return this.context.getImageData(0, 0, this.width, this.height).data;
    }

};
