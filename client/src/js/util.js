class main {
  /**
   * Check if an obj is empty, w/o any property.
   * 
   * @param {object} obj Any js object.
   * 
   * @return {boolean} True if empty.
   */
  static isEmpty(obj) {
    for (var key in obj) {
      if(obj.hasOwnProperty(key))
        return false;
    }
    return true;
  }

  /**
   * Create an array of int range.
   * 
   * @param {Number} lowerBound An int. 
   * @param {Number} upperBound An int.
   * 
   * @return {Array<Number>} Int array.
   */
  static range(lowerBound, upperBound) {
    let len = upperBound - lowerBound;
    return Array.from(new Array(len), (_, i) => i + lowerBound);
  }
}

export default main;