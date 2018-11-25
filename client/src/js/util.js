class main {
  /**
   * Check if an obj is empty, w/o any property.
   * 
   * @param {object} obj Any js object.
   * @return {boolean} True if empty.
   */
  static isEmpty(obj) {
    for (var key in obj) {
      if(obj.hasOwnProperty(key))
        return false;
    }
    return true;
  }
}

export default main;