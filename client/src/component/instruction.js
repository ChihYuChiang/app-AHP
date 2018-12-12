import React, { Component } from 'react';

import { Modal, ModalHeader, ModalBody } from 'reactstrap';

import { PosedAttY } from './pose';

import util from '../js/util';
import CONTENT from '../js/content';


class Instruction extends Component {
  /*
    props = {
      freshman //`true` to use grabAtt
      becomeOld //Set freshman to false
      className //For formatting the icon
    }
  */
  state = {
    modal: false,
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
          <ModalHeader toggle={this.toggleModal}>Instruction</ModalHeader>
          <ModalBody>
            {CONTENT.INSTRUCTION.STEP_INTRO}
            <h5 className="mt-3">Step 1</h5>
            {CONTENT.INSTRUCTION.STEP_1}
            <div><img src="asset/instruction_1.png" alt="step 1 illustration" /></div>
            <h5 className="mt-3">Step 2</h5>
            {CONTENT.INSTRUCTION.STEP_2}
            <div><img src="asset/instruction_2.png" alt="step 2 illustration" /></div>
            <h5 className="mt-3">Step 3</h5>
            {CONTENT.INSTRUCTION.STEP_3}
            <div><img src="asset/instruction_3.png" alt="step 3 illustration" /></div>
            <h5 className="mt-3">Step 4</h5>
            {CONTENT.INSTRUCTION.STEP_4}
            <div><img src="asset/instruction_4.png" alt="step 4 illustration" /></div>
            <h5 className="mt-3">Interpret the report</h5>
            <small>(You can retrieve a sample report by the Demo Result button)</small>
            <div><img src="asset/instruction_demo.png" alt="demo illustration" /></div>
            {CONTENT.INSTRUCTION.INTERPRET}
          </ModalBody>
        </Modal>
      </div>
    );
  }

  async componentDidMount() {
    let i = 0;
    await util.sleep(4000); //Repeat every 3 sec; end after 30 secs
    while (this.props.freshman) {
      this.grabAtt();
      i++;
      if (i === 8) this.props.becomeOld();
      await util.sleep(4000); //This structure ensures the `grabAtt` wont be triggered after freshman ends
    }
  }


  toggleModal = () => { //When clicked first time, end freshman status as well
    this.setState({
      modal: !this.state.modal,
    });
    this.props.becomeOld();
  };

  grabAtt = async () => {
    this.setState({ iconPose: "attention" });
    await util.sleep(600);
    this.setState({ iconPose: "offAttention" });
  };
}


export default Instruction;