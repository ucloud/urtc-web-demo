import React from "react";
import styled from "styled-components";
import { Loading, Icon } from "@ucloud-fe/react-components";
import { deviceDetection } from "urtc-sdk";
import { observer, inject } from "mobx-react";
import file from "../../common/music/test.wav";

/**
 * @param index
 * @param id
 */

// 样式
const LoadingText = styled.span`
  position: relative;
  width: 100%;
  height: 100%;
  line-height: 50px;
  text-align: left;
  box-sizing: "border-box";
  padding-left: 80px;
  display: inline-block;
`;

const ErrorWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  line-height: 60px;
  text-align: left;
  box-sizing: "border-box";
  color: #f44336;
`;

const ItemWrapper = styled.div`
  position: relative;
  width: 247px;
  background-color: rgb(56, 96, 244);
  border-radius: 4px;
  height: 30px;
  font-size: 12px;
  line-height: 30px;
  text-align: center;
  box-sizing: "border-box";
  cursor: pointer;
  color: #fff;
  margin: 10px 0 0 15%;
  overflow: hidden;

  .bg {
    background-color: #31386d;
    height: 100%;
    border-radius: 4px;
    z-index: 1;
    position: absolute;
    top: 0;
    left: 0;
    width: 0%;
  }
  .content {
    position: relative;
    z-index: 2;
  }
`;
@inject("store")
@observer
class SpeakerWrapper extends React.Component {
  static defaultProps = {
    index: 0,
    id: null,
    type: "input",
  };

  state = {
    volume: 0,
    show: true,
    errorInfo: null,
    loading: false,
    audioStatsPlay: false,
  };

  componentDidMount() { }

  testDevice = (callback) => {
    const { id } = this.props;
    deviceDetection(
      {
        audio: true,
        video: false,
        microphoneId: id,
      },
      (Result) => {
        if (Result.audio && Result.video) {
          // 麦克风和摄像头都可有和，发布或预览时可启用麦克风和摄像头
          this.setState({
            show: true,
          });
        } else if (Result.audio) {
          // 麦克风可用，发布或预览时能启用麦克风
        } else if (Result.video) {
          // 摄像头可用，发布或预览时能启用摄像头
          this.setState({
            show: false,
            errorInfo: Result.audioError,
          });
        } else {
          this.setState({
            show: false,
            errorInfo: Result.audioError,
          });
        }
        callback && callback();
      }
    );
  };

  playAudio = () => {
    const audio = document.createElement("audio");
    if (this.props.id) {
      audio.src = file;
      this.setState({
        audioStatsPlay: true,
      });

      setTimeout(() => {
        this.setState({
          audioStatsPlay: false,
        });
      }, 1500);
      if (audio.setSinkId) {
        audio.setSinkId(this.props.id).then(() => {
          console.log("检测扬声器ing");
          audio.play();
        });
      }

    }
  };

  render() {
    const { show, errorInfo, loading, audioStatsPlay } = this.state;
    return (
      <Loading
        loading={loading}
        tip={<LoadingText>检测中...</LoadingText>}
        indicator={null}
      >
        {show ? (
          <ItemWrapper onClick={this.playAudio}>
            <div className="bg"></div>
            <div className="content">
              {audioStatsPlay ? (
                <Icon type={"pause"} />
              ) : (
                  <Icon type={"caret-right"} />
                )}
              点此测试声音
            </div>
          </ItemWrapper>
        ) : (
            <ErrorWrapper>{errorInfo}</ErrorWrapper>
          )}
      </Loading>
    );
  }
}

export default SpeakerWrapper;
