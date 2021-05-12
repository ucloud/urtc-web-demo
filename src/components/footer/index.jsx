import React from "react";

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
import { isPC, objectToParamString, isSafari } from "../../util/index";
import CopyBtn from "../../container/copyBtn";
import {
  Footer,
  Status,
} from './style'

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
      videoMute       : false,
      audioMute       : false,
      videoRecord     : false,
      videoRelay      : false,
      recordVisible   : false,
      uplink          : "",
      downlink        : "",
      linkColor       : "#fff",
      setVolumeDisplay: false,
      relayShow       : false,
      recordShow      : false,
      paramsData      : null,
      roomId          : "",
      userName        : "",
      share           : "",
      copied          : false,
      lineFlag        : true,
      rtt             : 0,
      audioVolumeFlag : false,
      isPhone         : !isPC(),
      recordUrlShow   : false,
      recordPlayUrl   : null,
      isSafari        : isSafari(),
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
            roomId  : roomId,
            roomType: settingStore.roomType,
            onlyAudio: settingStore.onlyAudio
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
        if (MixNotification.code === "0" || MixNotification.code === "24151") {
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

  rtcShareScreen = () => {
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
          screenAudio: true
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

  unShareScreen = () => {
    let targetStream = this.Client.getLocalStreams().filter((e) => { return e.mediaType === "screen" })[0]
    this.props.unShareScreen(targetStream)
  }

  
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
      recordShow,
      isSafari,
    } = this.state;
    const { lineFlag, shareScreen } = this.props;

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
                        onClick={this.rtcShareScreen}
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
                  {
                    shareScreen && isSafari ?
                      <div
                        className="btn_wrapper active-publish"
                        onClick={this.unShareScreen}
                      >
                        <Button
                          // styleType="primary"
                          size={"md"}
                          style={{ marginLeft: "12px" }}
                        >
                          {"结束共享"}
                        </Button>
                      </div> : null
                  }

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
