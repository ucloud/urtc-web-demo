import React from "react";
import styled from "styled-components";
import { Progress, Loading } from "@ucloud-fe/react-components";
import { deviceDetection } from "urtc-sdk";
import { observer, inject } from "mobx-react";

/**
 * @param index
 * @param id
 * @param type  input or output,默认 input
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

@inject("store")
@observer
class VolumeProgress extends React.Component {
  static defaultProps = {
    index: 0,
    id: null,
    type: "input",
  };

  state = {
    volume: 0,
    show: true,
    errorInfo: null,
    loading: true,
    previewId: null,
  };

  componentDidMount() {
    this.testDevice(this.createStream(this.props.id));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.id !== this.props.id && !this.isWatching) {
      this.Client = nextProps.client;
      this.destroy(this.props.id);
      this.testDevice(this.createStream(nextProps.id));
    }
  }

  destroy = (id) => {
    if (id) {
      console.log("开始销毁流>>>");
      this.store = this.props.store.testingStore;
      this.store.sdkClient.destroyStream(id, (error) => {
        if (error) {
          console.log(`销毁流失败>>>:`, error);
        } else {
          console.log(`销毁流成功`);
        }
      });
    }
  };

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

  createStream = (id) => {
    console.log('createStream id', id)
    this.store = this.props.store.testingStore;
    this.store.sdkClient.createStream(
      {
        previewId: id,
        audio: true,
        video: false,
        microphoneId: id,
      },
      (error, stream) => {
        if (!error) {
          console.log("create audio stream success:", stream);
          this.timer = setInterval(() => {
            if (!this.state.show) {
              clearInterval(this.timer);
            }
            this.setState({
              volume: this.store.sdkClient.getAudioVolume(stream.sid),
              loading: false,
              previewId: `${id}`,
            });
          }, 200);
        } else {
          this.setState({
            loading: false,
            errorInfo: error.name,
          });
          clearInterval(this.timer)
          console.log("获取音量失败", error.name);
        }
      }
    );
  };
  render() {
    const { show, errorInfo, loading } = this.state;
    return (
      <Loading
        loading={loading}
        tip={<LoadingText>检测中...</LoadingText>}
        indicator={null}
      >
        {show ? (
          <div style={{ width: "90%" }}>
            <Progress
              percent={this.state.volume}
              format={null}
              style={{
                width: "247px",
                paddingTop: "25px",
                paddingLeft: "47px",
                display: "inline-block",
              }}
            />
            <span
              style={{
                display: "inline-block",
                paddingLeft: "10px",
              }}
            >
              {/* {this.state.volume} */}
            </span>
          </div>
        ) : (
            <ErrorWrapper>{errorInfo}</ErrorWrapper>
          )}
      </Loading>
    );
  }
}

export default VolumeProgress;
