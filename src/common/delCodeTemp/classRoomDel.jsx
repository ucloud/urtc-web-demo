// @ts-nocheck
/* eslint-disable */
import React from "react";
import { observer, inject } from "mobx-react";
import "./classRoom.css";
import "../common/ucloudicons/dist/css/icon.min.css";
import sdk, { Client } from "urtc-sdk";
import { Message } from "@ucloud-fe/react-components";
// import { copy } from "../util/index";
import ClassFooter from "../../components/footer/index";
import ClassHeader from "../../components/header/index";
import ClassVideoWrapper from "../../container/classVideoWrapper/index";
import { getCookie } from "../../util/cookie";
const { isSupportWebRTC } = sdk;

if (process.env.REACT_APP_ENV === "pre") {
  // pre 环境中使用未发布的 sdk，用于测试 sdk 的新功能
  console.log("set pre.urtc", process.env);
  // sdk.setServers({
  //   api: "https://pre.urtc.com.cn",
  //   log: "https://logpre.urtc.com.cn",
  // });
}
@inject("store")
@observer
class ClassRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      localStream: null,
      localCameraSid: 0,
      screenStream: null,
      remoteStreams: [],
      videoMute: false,
      audioMute: false,
      volumeMute: false,
      recordVisible: false,
      uplink: "",
      downlink: "",
      linkColor: "#fff",
      // setVolumeDisplay: false,
      relayShow: false,
      paramsData: null,
      roomId: "",
      userName: "",
      volumeData: "14",
      currentVideoItem: "local",
      remoteVolumeData: [],
      muteRemoteVolume: [],
    };
    this.setVolume = this.setVolume.bind(this);
    this.volumeChangwe = this.volumeChange.bind(this);
    this.videoChange = this.videoChange.bind(this);
  }
  componentDidMount() {
    let param = JSON.parse(getCookie("settingParam"));
    this.props.store.settings.settingsData(param);
    this.props.store.settings.joinRoom({
      roomId: param.roomId,
    });
    console.log("param", param);
    let locationState = this.props.location.state;
    if (!locationState) {
      this.props.history.push("/");
    } else {
      this.initURtc(locationState);
    }
  }
  initURtc(data) {
    this.setState({
      paramsData: data,
    });
    const storeData = this.props.store.settings;
    const storeClient = this.props.store.client;
    let roomId = data.roomId;
    let userId = this.props.store.settings.userId || data.userId;
    const AppId = storeData.AppId;
    const AppKey = storeData.AppKey;
    this.setState({
      roomId: roomId,
      userName: storeData.userName,
    });
    let token = sdk.generateToken(AppId, AppKey, roomId, userId);
    this.Client = new Client(AppId, token, {
      type: storeData.roomType,
      role: storeData.userRole,
      codec: storeData.videoCodec,
    });
    storeClient.initClient(this.Client);
    this.Client.joinRoom(roomId, userId, (e, s) => {
      Message.config({
        duration: 3000,
        top: 20,
      });
      this.Client.setVideoProfile({
        profile: storeData.videoProlie,
      });

      if (storeData.userRole !== "pull") {
        this.Client.publish(
          {
            audio: true,
            video: true,
            cameraId: storeData.videoInput,
          },
          function () {
            Message.message(<div>没有推流权限</div>, undefined, () =>
              console.log("onClose")
            );
          }
        );
      }
    });
    this.Client.on("stream-published", (stream) => {
      console.log(stream);

      if (stream.mediaType === "camera") {
        setInterval(() => {
          let volumnvalue = this.Client.getAudioVolume(stream.sid);
          volumnvalue = 14 - Math.ceil((volumnvalue / 100) * 8);
          this.setState({
            volumeData: volumnvalue,
          });
        }, 500);
        this.setState({
          localStream: stream,
          localCameraSid: stream.sid,
        });
      } else {
        this.setState({
          screenStream: stream,
          currentVideoItem: "screen",
        });
      }
    });

    this.Client.on("stream-reconnected", (streams) => {
      console.log("断网重连", streams);
      const { previous, current } = streams;
      const { remoteStreams = [] } = this.state;
      const idx = remoteStreams.findIndex((item) => previous.sid === item.sid);
      if (idx !== -1) {
        remoteStreams.splice(idx, 1);
        remoteStreams.push(current);
        this.setState({
          remoteStreams,
        });
      }
    });
    this.Client.on("screenshare-stopped", (stream) => {
      this.Client.unpublish(stream.sid, (e) => {
        console.log("取消推送共享");
        if (this.state.currentVideoItem == "screen") {
          this.setState({
            currentVideoItem: "local",
          });
        }
        this.setState({
          screenStream: null,
        });
      });
    });

    this.Client.on("stream-added", (stream) => {
      console.log(stream);
      this.Client.subscribe(stream.sid, (e) => {
        console.log("subscribe failure ", e);
      });
    });

    this.Client.on("stream-subscribed", (stream) => {
      console.log(stream);
      const { remoteStreams = [] } = this.state;

      // 发布桌面流切换布局
      if (stream.mediaType == "screen") {
        console.log("放大桌面流", `remote${stream.sid}`);
        this.setState({ currentVideoItem: stream.sid });
      }

      // 只拉流切换逻辑,订阅第一路流放大
      if (storeData.userRole == "pull" && !this.state.remoteStreams.length) {
        this.setState({
          currentVideoItem: stream.sid,
        });
      }

      //全局静音逻辑
      if (this.props.store.common.globalMuteAudioStats) {
        console.log("静一静", this.props.store.common.globalMuteAudioStats);
        this.Client.muteAudio(stream.sid);
      }

      remoteStreams.push(stream);
      this.setState(
        {
          remoteStreams,
          // videoList: this.client.getRemoteStreams()
        },
        () => {
          this.Client.play({
            streamId: stream.sid,
            container: stream.sid,
          });
        }
      );
    });

    this.Client.on("stream-removed", (stream) => {
      console.log("stream-removed ", stream);
      const { remoteStreams = [] } = this.state;
      const idx = remoteStreams.findIndex((item) => stream.sid === item.sid);
      if (idx !== -1) {
        remoteStreams.splice(idx, 1);
      }
      if (stream.sid == this.state.currentVideoItem) {
        this.setState({
          currentVideoItem: remoteStreams.length
            ? remoteStreams[0].sid
            : "local",
        });
      }
      this.setState({ remoteStreams });
    });
    this.Client.on("volume-indicator", (e) => {
      this.setState({
        remoteVolumeData: e,
      });
    }); 

    this.Client.on("mute-audio", (stream) => {
      let { remoteStreams } = this.state;
      let newRemote = remoteStreams.map((e) => {
        if (e.sid == stream.sid) {
          return stream;
        } else {
          return e;
        }
      });

      let muteRemote = this.state.muteRemoteVolume;
      let flag = false;
      muteRemote.map((e) => {
        if (e.sid === stream.sid) {
          flag = true;
        }
      });
      if (!flag) {
        muteRemote.push(stream);
        this.setState({
          muteRemoteVolume: muteRemote,
          remoteStreams: newRemote,
        });
      }
    });

    this.Client.on("mute-video", (stream) => {
      let { remoteStreams } = this.state;
      let newRemote = remoteStreams.map((e) => {
        if (e.sid == stream.sid) {
          return stream;
        } else {
          return e;
        }
      });
      this.setState({
        remoteStreams: newRemote,
      });
    });

    this.Client.on("unmute-video", (stream) => {
      let { remoteStreams } = this.state;
      let newRemote = remoteStreams.map((e) => {
        if (e.sid == stream.sid) {
          return stream;
        } else {
          return e;
        }
      });
      this.setState({
        remoteStreams: newRemote,
      });
    });

    this.Client.on("unmute-audio", (stream) => {
      let { remoteStreams } = this.state;
      let newRemote = remoteStreams.map((e) => {
        if (e.sid == stream.sid) {
          return stream;
        } else {
          return e;
        }
      });
      this.setState({
        remoteStreams: newRemote,
      });

      let muteRemote = this.state.muteRemoteVolume;
      muteRemote.map((e, v) => {
        if (e.sid === stream.sid) {
          muteRemote.splice(v, 1);
          this.setState(
            {
              muteRemoteVolume: muteRemote,
            },
            () => {
              console.log(this.state);
            }
          );
        }
      });
    });
  }

  volumeChange() {
    const { volumeMute, localStream, remoteStreams } = this.state;
    console.log(localStream.sid);
    console.log(remoteStreams);
    this.setState({
      volumeMute: !volumeMute,
    });
    if (volumeMute) {
      if (localStream.sid) {
        this.Client.setAudioVolume({
          streamId: localStream.sid,
          volume: 0,
        });
      }
      if (remoteStreams.length > 0) {
        remoteStreams.forEach((e) => {
          this.Client.setAudioVolume({
            streamId: e.sid,
            volume: 0,
          });
        });
      }
    } else {
      if (localStream.sid) {
        this.Client.setAudioVolume({
          streamId: localStream.sid,
          volume: 100,
        });
      }
      if (remoteStreams.length > 0) {
        remoteStreams.forEach((e) => {
          this.Client.setAudioVolume({
            streamId: e.sid,
            volume: 100,
          });
        });
      }
    }

    // if (setVolumeDisplay) {volumeMute
    //   this.setState({
    //     setVolumeDisplay: false,
    //   });
    // } else {
    //   this.setState({
    //     setVolumeDisplay: true,
    //   });
    // }
  }
  setVolume(e) {
    let volume = e.target.value;
    this.Client.setAudioVolume({ volume: parseInt(volume) }, (Err) => {
      if (Err) {
        alert(`设置声音失败 ${Err}`);
        return;
      }
    });
  }

  startRelay = (flag) => {
    this.setState({
      relayShow: flag,
    });
  };
  videoChange(e) {
    console.log("videoChange", e);
    this.setState({
      currentVideoItem: e,
    });
  }

  destoryStream = () => {
    this.setState({
      localStream: null,
    });
  };
  render() {
    const {
      localStream,
      remoteStreams,
      screenStream,
      // setVolumeDisplay,
      paramsData,
      currentVideoItem,
      localCameraSid,
    } = this.state;

    return (
      <div className="room_main">
        <ClassHeader
          client={this.Client}
          sid={localStream && localStream.sid}
        />

        <div className="video-wrapper">
          <div className="video-cur"></div>
          <ul className="video-list">
            {!localStream ? null : (
              <li
                className={`${"local" === currentVideoItem ? "li-current" : null
                  }`}
              >
                <div
                  className={`video-item ${"local" === currentVideoItem ? "video-current" : null
                    }`}
                >
                  <span
                    className="icon__maximize video-change"
                    title="切换到大屏"
                    onClick={() => this.videoChange("local")}
                  ></span>
                  <div className="local-video">
                    <ClassVideoWrapper
                      stream={Object.assign({
                        ...localStream,
                        muteVideo: this.props.store.common.localMuteVideo,
                        muteAudio: this.props.store.common.localMuteAudio,
                      })}
                    />
                  </div>
                </div>
              </li>
            )}

            {remoteStreams.map((stream) => (
              <li key={stream.sid}>
                <div
                  className={`video-item ${stream.sid === currentVideoItem ? "video-current" : null
                    }`}
                >
                  <span
                    className="icon__maximize video-change"
                    title="切换到大屏"
                    onClick={() => this.videoChange(stream.sid)}
                  ></span>

                  {stream.sid == localCameraSid ? (
                    <ClassVideoWrapper
                      stream={Object.assign({
                        ...stream,
                        muteVideo: this.props.store.common.localMuteVideo,
                        muteAudio: this.props.store.common.localMuteAudio,
                      })}
                    />
                  ) : (
                      <ClassVideoWrapper stream={stream} />
                    )}
                </div>
              </li>
            ))}
            {screenStream && screenStream.mediaStream ? (
              <li>
                <div
                  className={`video-item ${"screen" === currentVideoItem ? "video-current" : null
                    }`}
                >
                  <span
                    className="icon__maximize video-change"
                    title="切换到大屏"
                    onClick={() => this.videoChange("screen")}
                  ></span>
                  <ClassVideoWrapper stream={screenStream} />
                </div>
              </li>
            ) : null}
          </ul>
        </div>

        <ClassFooter
          client={this.Client}
          paramsData={paramsData}
          sid={localStream && localStream.sid}
          destoryStream={this.destoryStream}
        />
      </div>
    );
  }
}

export default ClassRoom;
