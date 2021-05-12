import React from "react";
import styled from "styled-components";
import { observer, inject } from "mobx-react";
// import ReactPlayer from "react-player";
import VideoStats from "../videoStats/index";
// import bgImg from "../../common/image/640360.png";

const Wrapper = styled.div`
  position: relative;
  height: 100%;
  border-radius: 6px;
  overflow: hidden;
  .bg {
    width: 100%;
    height: 100%;
    background-size: 100%;
    min-height: 103px;
    img {
      height: 100%;
      width: 100%;
    }
  }
`;

/**
 * @param stream  obj 流信息
 */

@inject("store")
@observer
class ClassVideoWrapper extends React.Component {
  static defaultProps = {};

  state = {
    stream: null,
  };

  componentDidMount() { }

  componentWillReceiveProps(nextProps) {
    if (this.props.stream.sid !== nextProps.stream.sid) {
      // this.forceUpdate();
    }
  }
  muteScreenAudio=()=>{
    console.log(this.props)
    this.Client = this.props.store.client.clientData;
    this.Client.muteAudio(this.props.stream.sid);
  }
  renderVideoWrapper = (stream) => {
    return (
      <div style={{ height: "100%", width: "100%" }}>
        {/* {this.props.store.settings.userId === stream.uid ? (
          <ReactPlayer
            // className="local-video"
            url={stream.mediaStream}
            muted={true}
            width="100%"
            height="100%"
            playing
            playsinline
          />
        ) : ( */}

        <div style={{ height: "100%", width: "100%" }} id={stream.sid}></div>
        {/* )} */}
        <div>

        </div>
      </div>
    );
  };

  render() {
    let { stream } = this.props;
    return (
      <Wrapper>
        <div style={{'display':'none'}} onClick={this.muteScreenAudio}>关闭分享音频</div>
        {!stream ? null : (
          <div style={{ width: "100%", height: "100%" }}>
            <div
              className="bg"
              style={{
                display: stream.muteVideo || !stream.video ? "block" : "none",
              }}
            >
              {/* <img src={bgImg} alt="" /> */}
            </div>

            <div
              style={{
                height: "100%",
                width: "100%",
                display: stream.muteVideo || !stream.video ? "none" : "block",
              }}
            >
              {this.renderVideoWrapper(stream)}
            </div>
          </div>
        )}
        
        <VideoStats stream={stream} />
      </Wrapper>
    );
  }
}

export default ClassVideoWrapper;
