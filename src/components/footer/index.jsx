import React from "react";
import styled from "styled-components";
import {
  Icon,
  Button,
  Row,
  Col,
  Message,
  Modal,
} from "@ucloud-fe/react-components";
import { observer, inject } from "mobx-react";
import RtcRelay from "../rtcRelay/index";
import Record from "../record";
import { isPC, objectToParamString } from "../../util/index";
import CopyBtn from "../../container/copyBtn";

const Footer = styled.div`
  position: absolute;
  /* height: ${(props) => (props.isPhone ? "139px" : "64px")}; */
  bottom: 0;
  left: 0;
  width: 100%;
  color: #fff;
  background-color: #2f3238;
  text-align: left;
  box-sizing: border-box;
  overflow: hidden;
  .left_wrapper {
    text-align: left;
  }
  .right_wrapper {
    text-align: right;
    box-sizing: border-box;
    padding-right: 14px;
  }
  .btn {
    margin-left: 12px;
    background-color: #494e5c;
    color: #fff;
    min-width: 64px;
  }
  .uc-fe-button {
    height: 32px;
    vertical-align: inherit;
  }
  .control_wrapper {
    position: relative;
    display: inline-block;
    margin-left: 16px;
    font-size: 18px;
    height: 28px;
    width: 34px;
    line-height: 28px;
    text-align: center;
    padding-top: 3px;
    cursor: pointer;
    background-color: #494e5c;
    vertical-align: middle;
    border-radius: 2px;
    color: #fff;
    box-shadow: 0px 1px 3px -1px rgba(0, 0, 0, 0.32),
      0px 1px 1px -1px rgba(0, 0, 0, 0.5), 0px 1px 2px 0px rgba(0, 0, 0, 0.28),
      0px 1px 0px 0px rgba(255, 255, 255, 0.12);
  }
  .btn_wrapper {
    display: inline-block;
    font-size: 12px;
    &.leave_btn_wrapper {
      padding-left: 6px;
      margin-left: 16px;
      border-left: 1px solid #5a5f73;
    }
    .leave_btn {
      background: #eb5252;
      color: #ffffff;
    }
  }
  .disable {
    color: #999;
  }
  .disable:after {
    display: block;
    content: "";
    width: 2px;
    height: 20px;
    background-color: #fff;
    position: absolute;
    border-radius: 2px;
    transform: rotate(-135deg);
    top: 7px;
    left: 16px;
  }
  .operation-item {
    display: inline-block;
    font-size: 34px;
    line-height: 40px;
    padding: 5px 40px 0;
    cursor: pointer;
    position: relative;
    .active-item {
      font-size: 16px;
      display: block;
      line-height: 20px;
      padding-bottom: 15px;
    }
  }

  &.video-footer {
    overflow: initial;
    background-color: #2f3238;
    padding-top: 18px;
    height: 66px;
  }
  @media screen and (max-width: 900px) {
    .video-footer {
      min-height: 40px;
      padding-top: 10px;
    }
  }
  @media screen and (max-width: 720px) {
    .video-footer {
      min-height: 40px;
      padding-top: 10px;
    }
    .video-header .room-info .roomId,
    .video-header .room-info .userName {
      padding: 0 10px;
    }
    .disable:after {
      top: 12px;
      left: 19px;
    }
    .video-header .network {
      top: 0;
      right: auto;
      left: 200px;
      margin-left: 0;
      line-height: 40px;
      font-size: 12px;
    }
    .video-header .uc-fe-icon {
      font-size: 16px;
    }
    .video-wrapper {
      bottom: 140px;
    }
    .video-wrapper .video-current video {
      left: 0;
      width: 100% !important;
      top: 36px;
      max-height: 220px;
    }
    .video-wrapper .video-cur {
      display: none;
    }
    .video-wrapper .video-list {
      position: absolute;
      top: 225px;
      width: 100%;
      bottom: 0;
    }
    .video-wrapper .video-list li {
      width: 46%;
      margin: 0;
      padding-left: 2.6%;
      margin: 0;
      float: left;
    }

    .footer-left {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      background-color: #1e2024;
      height: 60px;
    }
    .footer-left .left_wrapper {
      text-align: center;
    }
    .footer-left .left_wrapper .control_wrapper {
      width: 40px;
      height: 40px;
      border-radius: 20px;
      line-height: 40px;
      margin: 0 10px;
    }
    .footer-left .leave_btn_wrapper {
      display: inline-block;
      background-color: #eb5252;
    }
    .footer-right .btn_wrapper.leave_btn_wrapper {
      display: none;
    }
    .footer-left .left_wrapper .share-screen {
      display: none;
    }
    .footer-right {
      position: absolute;
      left: 0;
      bottom: 60px;
      height: 80px;
      width: 100%;
      background-color: #1e2024;
    }
    .footer-right .right_wrapper {
      text-align: center;
      border-bottom: 1px solid #5a5f73;
      padding: 0 0 20px;
      margin: 0 20px;
    }
    .footer-right .right_wrapper .btn_wrapper {
      width: 33%;
    }
    .footer-right .right_wrapper button {
      width: 80%;
      height: 40px;
      padding: 0;
      margin: 0 !important;
    }
    .footer-right .active-publish {
      text-align: left;
    }
    .footer-right .active-record {
      text-align: center;
    }
    .footer-right .active-relay {
      text-align: right;
    }
    .footer-right .right_wrapper .btn_wrapper.leave_btn_wrapper {
      border-left: none;
    }
    .footer-right .share-link {
      position: fixed;
      top: 4px;
      right: 4px;
      margin: 0;
      background: transparent;
    }
  }
`;

const Status = styled.div`
  position: relative;
  display: inline-block;
  padding: 6px;
  &:after {
    display: block;
    content: "";
    width: 6px;
    left: 0px;
    top: 5px;
    height: 6px;
    background-color: ${(props) => (props.color ? props.color : "#999")};
    /* animation: vc 1s infinite; */
    position: absolute;
    border-radius: 3px;
    z-index: 11;
  }
  /* @keyframes vc {
    from {
      background-color: #42d448;
    }
    to {
      background-color: #31a035;
    }
  } */
`;
/**
 * @param client sdk实例
 * @param paramsData obj
 * @param sid string 本地流id
 * @param unPublish fun 选填 ，下麦方法
 */

@inject("store")
@observer
class ClassFooter extends React.Component {
  static defaultProps = {};
  constructor(props) {
    super(props);
    this.state = {
      videoMute: false,
      audioMute: false,
      videoRecord: false,
      videoRelay: false,
      recordVisible: false,
      uplink: "",
      downlink: "",
      linkColor: "#fff",
      setVolumeDisplay: false,
      relayShow: false,
      recordShow: false,
      paramsData: null,
      roomId: "",
      userName: "",
      share: "",
      copied: false,
      lineFlag: true,
      rtt: 0,
      audioVolumeFlag: false,
      isPhone: !isPC(),
      recordUrlShow: false,
      recordPlayUrl: null,
    };
  }


  componentDidMount() { }

  componentWillReceiveProps(nextProps) {
    if (nextProps.client && !this.isWatching) {
      this.Client = nextProps.client;
      this.isWatching = true;
      this.setState(
        {
          paramsData: nextProps.paramsData,
        },
        () => {
          let { paramsData } = this.state;
          const { roomId } = paramsData;
          let settingStore = this.props.store.settings;
          let origin = window.location.origin;
          let paramsStr = objectToParamString({
            roomId: roomId,
            roomType: settingStore.roomType,
          });
          let share = `${origin}/share?${paramsStr}`;
          this.setState({
            share: encodeURI(share),
            copied: false,
          });
        }
      );
      this.Client.on("record-notify", (MixNotification) => {
        console.log(MixNotification, "MixNotification");
        if (MixNotification.code === "0") {
          this.setState({
            videoRecord: true,
          });
        } else {
          this.setState({
            videoRecord: false,
          });
        }
      });

      this.Client.on("relay-notify", (MixNotification) => {
        console.log(">>>>转推", MixNotification);
        if (MixNotification.code === "0") {
          this.setState({
            videoRelay: true,
          });
        } else {
          this.setState({
            videoRelay: false,
          });
        }
      });
    }
  }
  copyUrlRecord = () => {
    this.setState(
      {
        recordPlayUrl: this.props.store.record.url,
        copied: true,
      },
      () => {
        Message.success("复制地址成功");
      }
    );

    setTimeout(() => {
      this.setState({
        copied: false,
      });
    }, 400);
  };

  videoMute = () => {
    const { localMuteVideo } = this.props.store.common;

    if (!localMuteVideo) {
      this.Client.muteVideo(this.props.sid);
      this.props.store.common.setVideoMuteStats(true);
    } else {
      this.Client.unmuteVideo(this.props.sid);
      this.props.store.common.setVideoMuteStats(false);
    }
  };

  unPublish = () => {
    let { lineFlag } = this.state;
    console.log(this.props.sid);
    if (lineFlag) {
      this.Client.unpublish((stream) => {
        Message.success("下麦成功");
        this.props.destoryStream && this.props.destoryStream();
        this.setState({
          lineFlag: false,
          videoMute: false,
          audioMute: false,
        });
        this.props.store.common.setAudioMuteStats(false);
        this.props.store.common.setVideoMuteStats(false);
      });
    } else {
      this.Client.publish(
        {
          audio: true,
          video: true,
        },
        function () {
          Message.error(<div>没有推流权限</div>, undefined, () =>
            console.log("onClose")
          );
        }
      );
      this.setState({
        lineFlag: true,
      });
    }
  };

  copyUrl = () => {
    this.setState(
      {
        copied: true,
      },
      () => {
        Message.success("复制地址成功");
      }
    );

    setTimeout(() => {
      this.setState({
        copied: false,
      });
    }, 400);
  };

  audioMute = () => {
    const { localMuteAudio } = this.props.store.common;
    if (!localMuteAudio) {
      this.Client.muteAudio(this.props.sid);
      this.props.store.common.setAudioMuteStats(true);
    } else {
      this.Client.unmuteAudio(this.props.sid);
      this.props.store.common.setAudioMuteStats(false);
    }
  };

  shareScreen = () => {
    this.Client.setVideoProfile(
      this.props.store.settings.desktopProfile,
      () => {
        console.log(
          "setVideoProfile success ",
          this.props.store.settings.desktopProfile
        );
        this.Client.publish({
          audio: false,
          video: false,
          screen: true,
        });
      },
      (error) => {
        Message.error(error);
      }
    );
  };

  leaveRoom = () => {
    this.Client.leaveRoom();
    window.location.href = "/";
  };

  setVolume = (e) => {
    let { audioVolumeFlag } = this.state;
    //产品说是静音效果
    // let v = audioVolumeFlag ? 100 : 0;
    // console.log(v);
    // this.Client.setAudioVolume({ volume: v }, (Err) => {
    //   if (Err) {
    //     this.setState({
    //       audioVolumeFlag: false,
    //     });
    //     alert(`设置声音失败 ${Err}`);
    //     return;
    //   }
    //   this.setState({
    //     audioVolumeFlag: !audioVolumeFlag,
    //   });
    // });
    let totalStream = this.Client.getRemoteStreams();

    totalStream.forEach((stream) => {
      const { sid } = stream;
      if (audioVolumeFlag) {
        // 启用全部音频
        this.Client.unmuteAudio(sid);
      } else {
        this.Client.muteAudio(sid);
      }
    });

    this.props.store.common.setGlobalMuteAudioStats(!audioVolumeFlag);
    this.setState({
      audioVolumeFlag: !audioVolumeFlag,
    });
  };

  startRelay = (flag) => {
    this.setState({
      relayShow: flag,
    });
  };
  startRecord = (flag) => {
    // let storeRecord = this.props.store.record;
    const { videoRecord } = this.state;
    console.log(videoRecord)
    if (videoRecord) {
      this.Client.stopRecord((Error, Result) => {
        if (Error) {
          alert(`停止录制失败 ${Error}`);
          return;
        }
        console.log("stop record ", Result, this.props.store.record.url);
        // storeRecord.recordStart(false);
        this.setState({
          videoRecord: false,
          recordUrlShow: true,
          recordPlayUrl: this.props.store.record.url,
        });
      });
    } else {
      this.setState({
        recordShow: flag,
      });
    }

  }
  changeRecordUrlModal = () => {
    this.setState({
      recordUrlShow: false,
    });
  };

  render() {
    const {
      videoRecord,
      // recordVisible,
      videoRelay,
      // setVolumeDisplay,
      relayShow,
      paramsData,
      share,
      audioVolumeFlag,
      isPhone,
      recordUrlShow,
      recordShow
    } = this.state;
    const { lineFlag } = this.props;

    let videoMute = this.props.store.common.localMuteVideo;
    let audioMute = this.props.store.common.localMuteAudio;

    // userRole 为 pull 时，大部分按钮都要隐藏
    const { userRole } = this.props.store.settings;
    return (
      <Footer className="video-footer" isPhone={isPhone}>
        {paramsData && (
          <div style={{ height: "100%" }}>
            <Row style={{ height: "100%" }}>
              <Col span={3} className="footer-left">
                {userRole === "pull" ? null : (
                  <div className="left_wrapper">
                    <div
                      className={`control_wrapper ${videoMute ? "disable" : ""
                        }`}
                      onClick={this.videoMute}
                    >
                      <Icon type={"urtc-sxj"} />
                    </div>
                    <div
                      className={`control_wrapper ${audioMute ? "disable" : ""
                        }`}
                      onClick={this.audioMute}
                    >
                      <Icon type={"urtc-mkf"} />
                    </div>
                    <div
                      onClick={this.setVolume}
                      className={`control_wrapper footer-volume ${audioVolumeFlag ? "disable" : ""
                        }`}
                    >
                      <Icon type={"volume"} />
                    </div>
                    {isPhone ? null : (
                      <div
                        className={`control_wrapper share-screen`}
                        onClick={this.shareScreen}
                      >
                        <Icon type={"urtc-tl"} />
                      </div>
                    )}
                    <div
                      className="control_wrapper leave_btn_wrapper"
                      onClick={this.leaveRoom}
                    >
                      <Icon type={"power"} />
                    </div>
                  </div>
                )}
              </Col>

              <Col span={9} className="footer-right">
                <div className="right_wrapper">
                  {userRole === "pull" ? null : (
                    <div
                      className="btn_wrapper active-publish"
                      onClick={this.props.unPublish}
                    >
                      <Button
                        styleType="primary"
                        size={"md"}
                        style={{ marginLeft: "12px" }}
                      >
                        {lineFlag ? "结束连麦" : "开启连麦"}
                      </Button>
                    </div>
                  )}

                  <div
                    className={`btn_wrapper active-record ${videoRecord ? "video-record" : ""
                      }`}
                    // onClick={this.recordAction}
                    onClick={() => this.startRecord(true)}
                  >
                    <Button className="btn" styleType="border" size={"md"}>
                      <Status color={videoRecord ? "#42d448" : "#999"} />
                      {`${videoRecord ? "停止录制" : "录制"}`}
                    </Button>
                  </div>
                  <div
                    className="btn_wrapper active-relay"
                    onClick={() => this.startRelay(true)}
                  >
                    <Button className="btn" styleType="border" size={"md"}>
                      <Status color={videoRelay ? "#42d448" : "#999"} />
                      {videoRelay ? "结束转推" : "转推"}
                    </Button>
                  </div>

                  <div className={`control_wrapper share-link`}>
                    <CopyBtn url={share} />
                  </div>

                  <div
                    className="btn_wrapper leave_btn_wrapper"
                    onClick={this.leaveRoom}
                  >
                    <Button
                      size={"md"}
                      className="leave_btn"
                      style={{ marginLeft: "12px" }}
                    >
                      {"退出会议"}
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
            <RtcRelay
              client={this.Client}
              statsRefush={() => this.setState({ videoRelay: false })}
              close={() => this.startRelay(false)}
              show={relayShow}
              param={paramsData}
            />

            <Record close={() => this.startRecord(false)}
              show={recordShow} />

            <Modal
              visible={recordUrlShow}
              title={"录制地址"}
              size={isPhone ? "sm" : "md"}
              onClose={this.changeRecordUrlModal}
              // afterClose={this.destroyAll}
              footer={null}
            >
              <div
                style={{
                  padding: "16px 16px 16px 16px",
                  height: "100%",
                  lineHeight: "100%",
                }}
              >
                <span> {this.props.store.record.url}</span>
                <CopyBtn
                  url={this.props.store.record.url}
                  btn={
                    <Button styleType="primary" style={{ marginLeft: "12px" }}>
                      {"复制播放地址"}
                    </Button>
                  }
                />
              </div>
            </Modal>
          </div>
        )}
      </Footer>
    );
  }
}

export default ClassFooter;
