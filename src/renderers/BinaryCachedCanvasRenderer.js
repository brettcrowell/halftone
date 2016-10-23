import CachedCanvasRenderer from './CachedCanvasRenderer';

export default class BinaryCachedCanvasRenderer extends CachedCanvasRenderer {

  render(encoderOutput, rows=135, cols=240) {

    var pixelSize = this.options.pixelSize + (this.options.pixelSize % 2);
    var pixelRadius = pixelSize / 2;

    //@todo changing width/height resets and clears the canvas, making difference rendering impossible
    if(this.element.width != cols * pixelSize){
      this.element.width = cols * pixelSize;
    }

    if(this.element.height != rows * pixelSize){
      this.element.height = rows * pixelSize;
    }

    const context = this.element.getContext('2d');

    let pixelBitStart = 0;

    while(pixelBitStart < encoderOutput.length){

      const pixelIndex = pixelBitStart / 4;
      const currentRow = Math.floor(pixelIndex / cols);
      const currentCol = pixelIndex % cols;

      const binaryMagnitude = encoderOutput.substr(pixelBitStart, 4);

      if(binaryMagnitude != "0000"){

        const pixelMagnitude = (parseInt(binaryMagnitude, 2) - 1) / 14;
        const sourcePixel = this.getCachedPixel(pixelMagnitude, pixelSize);

        const xOffset = (currentRow % 2 === 0) ? pixelRadius : 0;
        const xOnCanvas = (currentCol * pixelSize) + xOffset;
        const yOnCanvas = currentRow * pixelSize;

        context.drawImage(sourcePixel, 0, 0, pixelSize, pixelSize, xOnCanvas, yOnCanvas, pixelSize, pixelSize);

      }

      pixelBitStart += 4;
    }
  }
}