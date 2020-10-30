import React from "react";
import styled from "styled-components";
import { observer, inject } from "mobx-react";
// import ReactPlayer from "react-player";
import { Message, Icon } from "@ucloud-fe/react-components";

import { CopyToClipboard } from "react-copy-to-clipboard";
const Wrapper = styled.div`
  position: relative;
  display: inline-block;
`;

/**
 * @param url
 * @param icon  obj 流信息
 */

@inject("store")
@observer
class CopyBtn extends React.Component {
  static defaultProps = {
    index: 0,
    id: null,
  };

  state = {
    url: null,
    show: true,
  };

  componentDidMount() {
    this.setState({
      url: encodeURI(this.props.url),
      copied: false,
    });
  }

  copyUrl = () => {
    this.setState({
      copied: true,
    });
    Message.info("复制成功");
  };

  render() {
    return (
      <Wrapper>
        <CopyToClipboard
          className="copy-btn"
          text={this.props.url}
          onCopy={this.copyUrl}
        >
          {this.props.btn ? this.props.btn : <Icon type={"share"} />}
        </CopyToClipboard>
        {this.props.children}
      </Wrapper>
    );
  }
}

export default CopyBtn;
