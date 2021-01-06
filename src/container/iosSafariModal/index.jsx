import React from "react";
import styled from "styled-components";
import { Modal } from "@ucloud-fe/react-components";

const Text = styled.div`
  position: relative;
  display: inline-block;
  padding: 8px 12px;
  line-height:18px;
`;

/**
 * @param play  function
 * @param show  bool 现实与否
 * @param close function
 */

class SafariHelpModal extends React.Component {
  static defaultProps = {
    show: false,
  };

  handleOk = () => {
      if(this.props.play){
        this.props.play()
        this.props.close()
      }else{
          throw new Error("play is undefined")
      } 
  }

  render() {
      const {show} = this.props;
    return (
        <Modal
        visible={show}
        size={"sm"}
        onOk={this.handleOk}
        onClose={this.props.close}
        title="播放视频"
      >   
        <Text>
        {'由于ios下的safari存在限制，需手动播放，请点击确定恢复播放'}
        </Text>
      </Modal>
    );
  }
}

export default SafariHelpModal;
