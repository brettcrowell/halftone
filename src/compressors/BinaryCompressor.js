export default class BinaryCompressor {
  getDifferenceMatrix(oldBinary, newBinary){

    if(oldBinary){

      let result = "";
      let i = 0;

      while(i < newBinary.length){

        const previousMagnitude = oldBinary.substr(i, 4);
        const currentMagnitude = newBinary.substr(i, 4);

        if(previousMagnitude === currentMagnitude){
          result += "0000";
        } else {
          result += currentMagnitude;
        }

        i += 4;

      }

      return result;

    } else {

      return newBinary;

    }

  }
}