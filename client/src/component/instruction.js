import React, { Component } from 'react';

import { Modal, ModalHeader, ModalBody } from 'reactstrap';

import { PosedAttY } from './pose';

import util from '../js/util';
import CONTENT from '../js/content';


class Instruction extends Component {
  /*
    props = {
      className //For formatting the icon
    }
  */
  state = {
    modal: false,
    freshman: true,
    iconPose: "offAttention"
  };

  render() {
    return (
      <div className={this.props.className}>
        <PosedAttY pose={this.state.iconPose}>
          <i className="fas fa-question-circle"
            onClick={this.toggleModal}
          />
        </PosedAttY>
        <Modal isOpen={this.state.modal} toggle={this.toggleModal}>
          <ModalHeader toggle={this.toggleModal}>3 Simple Steps to Use AHP</ModalHeader>
          <ModalBody>
            <h5>STEP 1</h5>
            <img src="asset/instruction_1.png" alt="instruction 1" />
            {CONTENT.INSTRUCTION.STEP_1}
            <h5>STEP 2</h5>
            <img src="asset/instruction_2.png" alt="instruction 2" />
            {CONTENT.INSTRUCTION.STEP_2}
            <h5>STEP 3</h5>
            <img src="asset/instruction_3.png" alt="instruction 3" />
            {CONTENT.INSTRUCTION.STEP_3}
          </ModalBody>
        </Modal>
      </div>
    );
  }

  async componentDidMount() {
    let i = 0;
    await util.sleep(4000); //Repeat every 3 sec; end after 30 secs
    while (this.state.freshman) {
      this.grabAtt();
      i++;
      if (i === 8) this.setState({ freshman: false });
      await util.sleep(4000); //This structure ensures the `graAtt` wont be triggered after freshman ends
    }
  }


  toggleModal = () => { //When clicked first time, end freshman status as well
    this.setState({
      modal: !this.state.modal,
      freshman: false
    });
  };

  grabAtt = async () => {
    this.setState({ iconPose: "attention" });
    await util.sleep(600);
    this.setState({ iconPose: "offAttention" });
  };
}


export default Instruction;