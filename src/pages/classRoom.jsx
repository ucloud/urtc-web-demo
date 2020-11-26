// @ts-nocheck
/* eslint-disable */
import React from "react";
import { observer, inject } from "mobx-react";
import "./classRoom.css";
import "../common/ucloudicons/dist/css/icon.min.css";
import sdk, { Client } from "urtc-sdk";
import { Message } from "@ucloud-fe/react-components";
import ClassFooter from "../components/footer/index";
import ClassHeader from "../components/header/new";
import ClassVideoWrapper from "../container/classVideoWrapper/index";
import { getCookie } from "../util/cookie";

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
      localCameraSid: "0",
      screenStream: null,
      videoMute: false,
      audioMute: false,
      volumeMute: false,
      recordVisible: false,
      uplink: "",
      downlink: "",
      linkColor: "#fff",
      relayShow: false,
      paramsData: null,
      roomId: "",
      userName: "",
      volumeData: "14",
      currentVideoItem: "local",
      remoteVolumeData: [],
      muteRemoteVolume: [],
      allStream: [],
      mailSid: null,
      mainStream: [],
      remoteStreams: [],
      lineFlag: true,

    };
    this.videoChange = this.videoChange.bind(this);
  }
  componentDidMount() {
    if (getCookie("settingParam") == undefined) {
      this.props.history.push("/");
      return
    }
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
    const signalLink = storeData.signalLink;
    this.setState({
      roomId: roomId,
      userName: storeData.userName,
    });
    console.log('sss', storeData)
    if (process.env.REACT_APP_ENV !== "pre" && signalLink !== ''){
      sdk.setServers({
        // api: storeData.apiLink,   // api 为 URTC 房间服务的访问地址
        // log: storeData.logLink, // log 为 URTC 日志服务的访问地址
        signal: signalLink, //storeData.signalLink // signal 为 URTC 信令服务的访问地址
      })
    }
    
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
        this.publish()
      }
    });
    this.Client.on("stream-published", (stream) => {
      const { allStream = [] } = this.state;
      allStream.push(stream);
      if (stream.mediaType === "camera") {
        if (this.state.mainStream.length && this.state.mainStream[0].mediaType === "screen") {
          this.setState(
            {
              localStream: stream,
              localCameraSid: stream.sid,
              mainType: "camera",
            },
            () => {
              this.getLayoutStream(allStream);
            }
          );
          return
        }
        this.setState(
          {
            mainSid: stream.sid,
            localStream: stream,
            localCameraSid: stream.sid,
            mainType: "camera",
          },
          () => {
            this.getLayoutStream(allStream);
          }
        );
      }

      if (stream.mediaType === "screen") {
        let nextId = stream.sid;
        this.setState(
          {
            mainSid: nextId,
          },
          () => {
            this.getLayoutStream(allStream);
          }
        );
      }
    });

    this.Client.on("screenshare-stopped", (stream) => {
      console.log("screenshare-stopped", stream);
      this.Client.unpublish(stream.sid, (e) => {
        const { allStream = [] } = this.state;
        let arr = this.filterStream(allStream, stream.sid);
        if (stream.sid == this.state.mailSid) {
          let targetId = localStream ? localStream.sid : (arr.length ? arr[0].sid : null)
          this.setState(
            {
              allStream: arr,
              mainSid: targetId
            },
            () => {
              this.getLayoutStream(arr);
            }
          )
          return
        } else {
          this.setState(
            {
              allStream: arr,
            },
            () => {
              this.getLayoutStream(arr);
            }
          );
          return
        }
      });
    });

    this.Client.on("stream-reconnected", (streams) => {
      console.log("断网重连", streams);
      const { previous, current } = streams;
      const { allStream = [] } = this.state;
      const idx = allStream.findIndex((item) => previous.sid === item.sid);
      if (idx !== -1) {
        allStream.splice(idx, 1);
        allStream.push(current);
        if (this.state.mainSid === previous.sid) {
          this.setState({
            mainSid: current.sid,
          }, () => {
            this.getLayoutStream(allStream)
          })
          return
        } else {
          this.setState({
            allStream,
          }, () => {
            this.getLayoutStream(allStream)
          });
        }

      }
    });

    this.Client.on("stream-subscribed", (stream) => {
      console.log("stream-subscribed", stream);

      const { allStream = [] } = this.state;
      allStream.push(stream);

      if (stream.mediaType === "screen") {
        let nextId = stream.sid;
        this.setState(
          {
            mainSid: nextId,
          },
          () => {
            this.getLayoutStream(allStream);
          }
        );
        return;
      }
      this.setState(
        {
          allStream: allStream,
        },
        () => {
          this.getLayoutStream(allStream);
        }
      );
    });

    this.Client.on("stream-added", (stream) => {
      this.Client.subscribe(stream.sid, (e) => {
        console.log("subscribe failure ", e);
      });
    });

    this.Client.on("stream-removed", (stream) => {
      console.log("stream-removed ", stream);
      const { allStream = [] } = this.state;
      let arr = this.filterStream(allStream, stream.sid);

      this.setState(
        {
          allStream: arr,
        },
        () => {
          this.getLayoutStream(arr);
        }
      );
    });

    this.Client.on("volume-indicator", (e) => {
      this.setState({
        remoteVolumeData: e,
        allStream,
      });
    });

    this.Client.on("mute-audio", (stream) => {
      let { allStream } = this.state;
      let newRemote = allStream.map((e) => {
        if (e.sid == stream.sid) {
          return stream;
        } else {
          return e;
        }
      });

      this.setState(
        {
          allStream: newRemote,
        },
        () => {
          this.getLayoutStream(newRemote, false);
        }
      );
    });

    this.Client.on("mute-video", (stream) => {
      let { allStream } = this.state;
      let newRemote = allStream.map((e) => {
        if (e.sid == stream.sid) {
          return stream;
        } else {
          return e;
        }
      });

      this.setState(
        {
          allStream: newRemote,
        },
        () => {
          this.getLayoutStream(newRemote, false);
        }
      );
    });

    this.Client.on("unmute-video", (stream) => {
      let { allStream } = this.state;
      let newRemote = allStream.map((e) => {
        if (e.sid == stream.sid) {
          return stream;
        } else {
          return e;
        }
      });

      this.setState(
        {
          allStream: newRemote,
        },
        () => {
          this.getLayoutStream(newRemote, false);
        }
      );
    });

    this.Client.on("unmute-audio", (stream) => {
      let { allStream } = this.state;
      let newRemote = allStream.map((e) => {
        if (e.sid == stream.sid) {
          return stream;
        } else {
          return e;
        }
      });

      this.setState(
        {
          allStream: newRemote,
        },
        () => {
          this.getLayoutStream(newRemote, false);
        }
      );
    });
  }

  startRelay = (flag) => {
    this.setState({
      relayShow: flag,
    });
  };

  publish = () => {
    const storeData = this.props.store.settings;
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

  //下麦操作
  unPublish = () => {
    let { lineFlag } = this.state;
    if (lineFlag) {
      this.Client.unpublish((stream) => {
        Message.success("下麦成功");
        let { allStream, localStream } = this.state;
        const idx = allStream.findIndex((item) => localStream.sid === item.sid)
        if (idx !== -1) {
          allStream.splice(idx, 1);
          console.log('>>>>下', allStream)
          this.setState({
            localStream: null,
            allStream: allStream,
            lineFlag: false,
          }, () => {
            this.props.store.common.setAudioMuteStats(false);
            this.props.store.common.setVideoMuteStats(false);
            this.getLayoutStream(allStream);
          });
        }
      });
    } else {
      this.publish()
      this.setState({
        lineFlag: true,
      });
    }
  };

  videoChange(e) {
    this.setState(
      {
        mainSid: e.sid,
      },
      () => {
        this.stopStreams();
        this.getLayoutStream(this.state.allStream);
      }
    );
  }

  // arr 为最新全部流数组, refreshFlag 为是否stop or play全部视频
  getLayoutStream = (arr = [], refreshFlag = true) => {
    console.log('res', arr)
    if (refreshFlag) {
      this.stopStreams();
    }
    const { mainSid } = this.state;
    let mainArr = [];
    let remoteArr = [];

    arr.map((e) => {
      if (e.sid === mainSid) {
        mainArr.push(e);
      } else {
        remoteArr.push(e);
      }
    });

    //主屏幕没流
    if (mainArr.length == 0 && remoteArr.length >= 1) {
      mainArr.push(remoteArr[0]);
      remoteArr.splice(0, 1)
    }
    this.setState(
      {
        mainStream: mainArr,
        remoteStreams: remoteArr,
      },
      () => {
        if (refreshFlag) {
          this.playStreams();
        }
      }
    );

  };

  stopStreams = () => {
    let { allStream = [] } = this.state;
    let arr = allStream.map((stream) => {
      return new Promise((resolve, reject) => {
        this.Client.stop(stream.sid, (err) => {
          if (!err) {
            resolve();
          } else {
            reject(err);
          }
        });
      });
    });
    return Promise.all(arr);
  };

  playStreams = () => {
    let { allStream = [] } = this.state;
    for (let index = 0; index < allStream.length; index++) {
      const id = allStream[index].sid;
      if (allStream[index].mediaType === "screen") {
        this.Client.play(
          { streamId: id, container: id, fit: "cover" },
          (err) => {
            if (!err) {
              reject(console.log("播放失败", err, prevId));
            }
          }
        );
      } else {
        this.Client.play(
          { streamId: id, container: id, fit: "contain" },
          (err) => {
            if (!err) {
              reject(console.log("播放失败", err, prevId));
            }
          }
        );
      }

    }
  };

  filterStream = (arr, sid) => {
    const idx = arr.findIndex((item) => sid === item.sid);
    if (idx !== -1) {
      arr.splice(idx, 1);
      return arr;
    }
  };

  render() {
    const {
      localStream = { sid: 0 },
      paramsData,
      mainStream,
      remoteStreams,
      localCameraSid,
      lineFlag,
    } = this.state;
    return (
      <div className="room_main">
        <ClassHeader
          client={this.Client}
          sid={localStream && localStream.sid}
        />

        <div className="video-wrapper">
          <div className="video-cur">
            {mainStream.map((stream, index) => {
              return (
                <div
                  className="video-current"
                  style={{
                    height: "100%",
                    width: "100%",
                  }}
                  key={index}
                >
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
              );
            })}
          </div>
          <ul className="video-list">
            {remoteStreams.map((stream, key) => (
              <li key={key}>
                <div className={`video-item`}>
                  {/* {stream.mediaType === "screen" ? null : ( */}
                  <span
                    className="icon__maximize video-change"
                    title="切换到大屏"
                    onClick={() => this.videoChange(stream)}
                  ></span>
                  {/* )} */}

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
          </ul>
        </div>

        <ClassFooter
          client={this.Client}
          paramsData={paramsData}
          sid={localStream && localStream.sid}

          unPublish={this.unPublish}
          lineFlag={lineFlag}
        />
      </div>
    );
  }
}

export default ClassRoom;
