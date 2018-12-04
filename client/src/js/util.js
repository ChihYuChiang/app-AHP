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

  /**
   * A `setTimeout` Promise wrapper.
   * 
   * @param {Number} ms Duration.
   * 
   * @return {Promise} A promised resolved after sleeping ms.
   */
  static sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Shuffles array in place.
   * 
   * @param {Array} a An array to be shuffled.
   */
  static shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
}

export default main;