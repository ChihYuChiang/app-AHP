class main {
  /**
   * Check if an obj is empty, w/o any property.
   * 
   * @param {object} obj Any js object.
   * 
   * @return {boolean} True if empty.
   */
  //TODO: remove this one; use lodash
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
   * Series product of all numbers between a and b
   * 
   * @param {Number} lowerBound An int. 
   * @param {Number} upperBound An int.
   * 
   * @return {Number}
   */
  static rangeProduct(lowerBound, upperBound) {
    var prd = lowerBound, i = lowerBound;
   
    while (i++ < upperBound) {
      prd *= i;
    }
    return prd;
  }
  
  /**
   * C n get r
   * 
   * @param {Number} n An int. 
   * @param {Number} r An int.
   * 
   * @return {Number} Number of combination.
   */
  static combinations(n, r) {
    if (n === r) {
      return 1;
    } 
    else {
      r = (r < n - r) ? n - r : r;
      return this.rangeProduct(r + 1, n) / this.rangeProduct(1, n - r);
    }
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

  /**
   * A handler for EnterKey events.
   * 
   * @param {Event} evt KeyPress/KeyUp/KeyDown event.
   * @param {Function} cb Callback function. Usually the onClick handler of the corresponding button.
   */
  static handleEnterKey(evt, cb) {
    //Some browsers use keyCode, others use which.
    //13 is the "Enter" key on the keyboard
    const keyCode = evt.keyCode || evt.which;
    if (keyCode === 13) {
      cb();
    }
  }

  /**
   * Makes function chainable: the function calls happen in-order after calls before that.
   * https://dev.to/chromiumdev/cancellable-async-functions-in-javascript-5gp7
   * 
   * @param {Function} fn function to be decorated.
   * 
   * @return {Promise} A promise with fn calls appended to it
   */
  static makeChainable(fn) {
    let p = Promise.resolve(true); //This starts this line of async execution

    return (...args) => {
      p = p.then(() => fn(...args)); //This updates the above `p` every time the `fn` is called
      return p; //This makes sure the return from the `fn` is returned when the promise resolved
    };
  }

  /**
   * Scroll window to a specified topOffset.
   * 
   * @param {Number} topOffset Y offset from the top of the page.
   * @param {String} behavior "smooth" or "auto" (jump to location). Default to "smooth".
   */
  static scrollTo(topOffset, behavior="smooth") {
    window.scroll({
      top: topOffset,
      behavior: behavior
    });
  }
}


export default main;