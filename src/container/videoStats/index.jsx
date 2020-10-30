import React from "react";
import styled from "styled-components";
import { observer, inject } from "mobx-react";
// import ReactPlayer from "react-player";

const Wrapper = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.3);
  font-size: 12px;
  line-height: 24px;
  height: 25px;
  text-align: left;
  padding-left: 15px;
  .mute-stats {
    color: rgb(192, 185, 185);
  }
  .volume-wrapper {
    float: right;
    padding-top: 2px;
    width: 24px;
    text-align: center;
    position: relative;
  }
  .mute-stats:after {
    display: block;
    content: "";
    width: 2px;
    height: 16px;
    /* background-color: rgb(192, 185, 185); */
    background-color: #fff;

    position: absolute;
    border-radius: 2px;
    transform: rotate(-135deg);
    top: 6px;
    left: 11px;
  }
`;

/**
 * @param id
 * @param stream  obj 流信息
 */

@inject("store")
@observer
class VideoStats extends React.Component {
  static defaultProps = {
    index: 0,
    id: null,
  };

  state = {
    stream: null,
    show: true,
  };

  componentDidMount() {}

  render() {
    let { stream } = this.props;
    return (
      <Wrapper>
        {!stream ? null : (
          <div>
            <span className="user-name">{stream ? stream.uid : ""}</span>
            {stream.video ? (
              <span
                className={`volume-wrapper  ${
                  stream.muteVideo ? "mute-stats" : ""
                }`}
              >
                <span className="icon__urtc-sxj"></span>
              </span>
            ) : null}

            <span
              className={`volume-wrapper  ${
                stream.muteAudio ? "mute-stats" : ""
              }`}
            >
              <span className="icon__urtc-mkf"></span>
            </span>
          </div>
        )}
      </Wrapper>
    );
  }
}

export default VideoStats;
