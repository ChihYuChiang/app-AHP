import validate from 'validator';

import CONST from './const';


class Validator {
  constructor(input) {
    this.input = input;
    this.pass = true;
    this.comment = [];
  }

  //--Validate criteria
  isntEmpty = () => {
    if (validate.isEmpty(this.input)) {
      this.pass = false;
      this.comment.push(CONST.VAL_CMT.EMPTY);
    }
    return this;
  }
  longerThan = (min) => {
    if (!validate.isLength(this.input, { min: min + 1, max: undefined })) {
      this.pass = false;
      this.comment.push(CONST.VAL_CMT.TOO_SHORT);
    }
    return this;
  }
  shorterThan = (max) => {
    if (!validate.isLength(this.input, { min: 0, max: max - 1 })) {
      this.pass = false;
      this.comment.push(CONST.VAL_CMT.TOO_LONG);
    }
    return this;
  }
  equalTo = (target) => {
    if (!validate.equals(this.input, target)) {
      this.pass = false;
      this.comment.push(CONST.VAL_CMT.NOT_EQUAL);
    }
    return this;
  }
  isAlpha = () => {
    if (!validate.isAlpha(this.input)) {
      this.pass = false;
      this.comment.push(CONST.VAL_CMT.NOT_ALPHA);
    }
    return this;
  }
  isNumeric = () => {
    if (!validate.isNumeric(this.input)) {
      this.pass = false;
      this.comment.push(CONST.VAL_CMT.NOT_NUMBER);
    }
    return this;
  }
  isAlphaNumber = () => {
    if (!validate.isAlphanumeric(this.input)) {
      this.pass = false;
      this.comment.push(CONST.VAL_CMT.NOT_ALPHA_NUMBER);
    }
    return this;
  }

  //--Input modification
  removeSpace = () => {
    this.input = this.input.split(' ').join('');
    return this;
  }
}


export default Validator;