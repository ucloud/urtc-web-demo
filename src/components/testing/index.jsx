import React from "react";
import {
  Modal,
  Steps,
  Notice,
  Row,
  Col,
  Message,
} from "@ucloud-fe/react-components";
import { observer, inject } from "mobx-react";
import { randNum } from "../../util";
import CameraTest from "../cameraTest/index.jsx";
import SpeakerTest from "../speakerTest/index.jsx";
import MicTest from "../micTest/index.jsx";
import {
  StepWrapper, ErrorWrapper, BtnWrapper, EndWrapper
} from './index.styles'
import {
  // isWeChat,
} from '../../util/index'
import sdk, {
  Client,
  getDevices,
  isSupportWebRTC,
  deviceDetection,
} from "urtc-sdk";

const deviceType = {
  AUDIOINPUT: {
    type: "audioinput",
    des: "音频输入",
  }, //音频输入
  AUDIOOUTPUT: {
    type: "audiooutput",
    des: "音频输出",
  }, //音频输出
  VIDEOINPUT: {
    type: "videoinput",
    des: "视频输入",
  }, //视频输入
};

/**
 * @param show  bool 必传，控制组件现实隐藏
 * @param close fun 必传, 关闭modal函数
 * @description 设备检测模块包含：rtc能力测试，音视频设备状态测试
 *
 */

// 样式
//模块
@inject("store")
@observer
class Testing extends React.Component {
  static defaultProps = {
    show: false,
  };

  state = {
    allDeviceList: [],
    audioInputDeviceList: [],
    audioInputStream: [],
    audioOutputDeviceList: [],
    videoDeviceList: [],
    rtcSupportFlag: false,
    rtcSupportError: null,
    errorInfo: "",
    stepCurrent: 0,
    steps: [
      {
        title: "摄像头检测",
        key: "testVideo",
      },
      {
        title: "扬声器检测",
        key: "testSpeaker",
      },
      {
        title: "麦克风检测",
        key: "testMic",
      },
      {
        title: "检测结果",
        key: "end",
      },
    ],
    statusMap: {
      camera: true,
      speaker: true,
      mic: true,
    },
  };
  constructor(props) {
    super(props);
    console.log(this.state);
  }

  componentDidMount() {
    this.testRtcSupport();
    this.getDevicesList();
    this.initRtc();
  }

  next = () => {
    let { stepCurrent, steps } = this.state;
    if (stepCurrent === steps.length - 1) {
      return;
    }
    let num = stepCurrent + 1;
    this.setState({
      stepCurrent: num,
    });
  };

  prev = () => {
    let { stepCurrent } = this.state;
    if (stepCurrent === 0) {
      return;
    }
    let num = stepCurrent - 1;
    this.setState({
      stepCurrent: num,
    });
  };

  destroy = (id) => {
    if (id) {
      console.log("开始销毁流>>>");
      this.store = this.props.store.testingStore;
      this.store.sdkClient.destroyStream(id, (error) => {
        if (error) {
          console.log(`销毁流失败>>>:`, error);
        } else {
          console.log(`销毁流成功>>>`);
        }
      });
    }
  };

  destroyAll = () => {
    this.store = this.props.store.testingStore;
    const result = this.store.sdkClient.getLocalStreams();
    for (let index = 0; index < result.length; index++) {
      const element = result[index];
      this.destroy(element.previewId);
    }
  };

  initRtc = () => {
    const storeData = this.props.store.settings;
    let roomId = `testDevice${randNum(8)}`;
    let userId = randNum(8);
    const AppId = storeData.AppId;
    const AppKey = storeData.AppKey;
    let token = sdk.generateToken(AppId, AppKey, roomId, userId);
    this.client = new Client(AppId, token);
    this.props.store.testingStore.setSdkClient(this.client);
  };

  getDevicesList = () => {
    const {
      audioInputDeviceList,
      audioOutputDeviceList,
      videoDeviceList,
    } = this.state;
    getDevices(
      (MediaDeviceInfos) => {
        console.log("MediaDeviceInfos", MediaDeviceInfos)
        this.setState({
          allDeviceList: MediaDeviceInfos,
        });
        for (let index = 0; index < MediaDeviceInfos.length; index++) {
          const element = MediaDeviceInfos[index];
          // 音频输入
          if (element.kind === deviceType.AUDIOINPUT.type) {
            audioInputDeviceList.push(element);
          }
          // 音频输出
          if (element.kind === deviceType.AUDIOOUTPUT.type) {
            audioOutputDeviceList.push(element);
          }
          // 视频输入
          if (element.kind === deviceType.VIDEOINPUT.type) {
            videoDeviceList.push(element);
          }
        }
        this.setState({
          audioInputDeviceList,
          audioOutputDeviceList,
          videoDeviceList,
        });
        console.log(
          "getDevicesList success",
          audioInputDeviceList,
          audioOutputDeviceList,
          videoDeviceList
        );
      },
      (error) => {
        console.log("getDevicesList fail", error);
        Message.error(error);
        this.getDevicesList();
      }
    );
  };

  closeModal = () => {
    this.destroyAll();
    this.props.close && this.props.close();
  };

  changeType = (e) => {
    this.setState({
      selectType: e,
    });
  };

  testRtcSupport = () => {
    const result = isSupportWebRTC();
    if (result) {
      this.setState({
        rtcSupportFlag: true,
      });
    }
    deviceDetection(
      {
        audio: true,
        video: true,
      },
      (Result) => {
        console.log(Result);
        if (Result.audio && Result.video) {
          // 麦克风和摄像头都可，发布或预览时可启用麦克风和摄像头
        } else if (Result.audio) {
          // 麦克风可用，发布或预览时能启用麦克风
          this.setState({
            rtcSupportFlag: false,
            errorInfo: `摄像头不可用:${Result.videoError}`,
          });
        } else if (Result.video) {
          // 摄像头可用，发布或预览时能启用摄像头
          this.setState({
            rtcSupportFlag: false,
            errorInfo: `麦克风不可用:${Result.audioError}`,
          });
        } else {
          // 麦克风和摄像头都不可用
          this.setState({
            rtcSupportFlag: false,
            errorInfo: `麦克风和摄像头皆不可用:${Result.audioError}`,
          });
        }
      }
    );
  };

  testSuc = (type) => {
    let _s = this.state.statusMap;
    _s[type] = true;
    this.setState({
      statusMap: _s,
    });
    this.next();
  };

  reset = () => {
    this.setState({
      stepCurrent: 0,
    });
  };

  testFail = (type) => {
    let _s = this.state.statusMap;
    _s[type] = false;
    this.setState({
      statusMap: _s,
    });
    this.next();
  };


  renderBtn = () => {
    const { camera = true, speaker = true, mic = true, } = this.state.statusMap;
    if (camera && speaker && mic) {
      return (
        <BtnWrapper onClick={this.closeModal}>关闭</BtnWrapper>
      )
    } else {
      return (<BtnWrapper onClick={this.reset}>重新检测</BtnWrapper>)
    }
  }

  render() {
    const { show } = this.props;
    const {
      rtcSupportFlag,
      errorInfo,
      stepCurrent,
      steps,
      videoDeviceList,
      audioOutputDeviceList,
      audioInputDeviceList,
      statusMap,
    } = this.state;
    // const {} = this.props.store;
    console.log(statusMap);
    return (
      <div>
        {show?
            <Modal
            visible={show}
            title={"检测"}
            size="md"
            // width={560}
            onClose={this.closeModal}
            afterClose={this.destroyAll}
            footer={null}
            destroyOnClose={false}
          >
            {rtcSupportFlag && videoDeviceList.length ? (
              <StepWrapper>
                <Steps
                  steps={steps}
                  current={steps[stepCurrent].key}
                  status={"current"}
                />
                {stepCurrent === 0 && (
                  <CameraTest
                    client={this.client}
                    list={videoDeviceList}
                    onOk={this.testSuc.bind(this, "camera")}
                    onCancel={this.testFail.bind(this, "camera")}
                  />
                )}
    
                {stepCurrent === 1 && (
                  <SpeakerTest
                    client={this.client}
                    list={audioOutputDeviceList}
                    onOk={this.testSuc.bind(this, "speaker")}
                    onCancel={this.testFail.bind(this, "speaker")}
                  />
                )}
                {stepCurrent === 2 && (
                  <MicTest
                    client={this.client}
                    list={audioInputDeviceList}
                    onOk={this.testSuc.bind(this, "mic")}
                    onCancel={this.testFail.bind(this, "mic")}
                  />
                )}
                {stepCurrent === 3 && (
                  <EndWrapper>
                    <div className="content">
                      <Row gutter={0}>
                        <Col offset={2} span={4}>
                          <div className="left">检测项目</div>
                        </Col>
                        <Col span={4}>
                          <div className="right">检测结果</div>
                        </Col>
                      </Row>
                      <Row gutter={0}>
                        <Col offset={2} span={4}>
                          <div className="left">摄像头</div>
                        </Col>
                        <Col span={4}>
                          <div className="right">
                            {statusMap.camera ? (
                              <p>正常</p>
                            ) : (
                                <p className="error">异常</p>
                              )}
                          </div>
                        </Col>
                      </Row>
                      <Row gutter={0}>
                        <Col offset={2} span={4}>
                          <div className="left">扬声器</div>
                        </Col>
                        <Col span={4}>
                          <div className="right">
                            {statusMap.speaker ? (
                              <p>正常</p>
                            ) : (
                                <p className="error">异常</p>
                              )}
                          </div>
                        </Col>
                      </Row>
    
                      <Row gutter={0}>
                        <Col offset={2} span={4}>
                          <div className="left">麦克风</div>
                        </Col>
                        <Col span={4}>
                          <div className="right">
                            {statusMap.mic ? (
                              <p>正常</p>
                            ) : (
                                <p className="error">异常</p>
                              )}
                          </div>
                        </Col>
                      </Row>
                    </div>
                    {!statusMap.mic && (
                      <p className="errorInfo">当前您的麦克风异常，无法进入直播</p>
                    )}
                    {this.renderBtn()}
                  </EndWrapper>
                )}
              </StepWrapper>
            ) : (
                <ErrorWrapper>
                  <Notice closable={false} styleType={"error"}>
                    {errorInfo}
                  </Notice>
                </ErrorWrapper>
              )}
          </Modal>
        :null
      }
      </div>
    );
  }
}

export default Testing;
