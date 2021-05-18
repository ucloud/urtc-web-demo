// @ts-nocheck
/* eslint-disable */
import React from "react";
import { observer, inject } from "mobx-react";
import ReactPlayer from "react-player";
import "./classRoom.css";
import "../common/ucloudicons/dist/css/icon.min.css";
import sdk, { Client } from "urtc-sdk";
import { Message } from "@ucloud-fe/react-components";
// import { copy } from "../util/index";
import ClassFooter from "../components/footer/index";
import ClassHeader from "../components/header/index";

import SafariHelpModal from "../container/iosSafariModal/index";
import { getCookie } from "../util/cookie";
import { openFullscreen, isPC, isSafari, isIOS, isWeChat } from "../util/index";
import { findDOMNode } from "react-dom";


@inject("store")
@observer
class ClassRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      localStream: null,
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
      muteRemoteVideo: [],
      safariShow: false,
      lineFlag: true,
    };
    this.setVolume = this.setVolume.bind(this);
    this.volumeChange = this.volumeChange.bind(this);
    this.videoChange = this.videoChange.bind(this);
    this.unPublish = this.unPublish.bind(this);
  }
  componentDidMount() {
    if (getCookie("settingParam") == undefined) {
      this.props.history.push("/");
      return;
    }
    console.log(getCookie("settingParam"));
    let param = JSON.parse(getCookie("settingParam"));
    console.log();
    this.props.store.settings.settingsData(param);
    this.props.store.settings.joinRoom({
      roomId: param.roomId,
    });
    if (param.userRole === "pull" && isIOS() && isWeChat()) {
      this.setState({
        safariShow: true,
      });
    }

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

      this.Client.publish(
        {
          audio: true,
          video: !storeData.onlyAudio,
        },
        (Result) => {
          if (Result.audio === false && Result.video === false) {
            Message.error("没有可用音视频设备");
          } else {
            this.Client.publish(
              {
                audio: Result.audio,
                video: !storeData.onlyAudio, //Result.video,
                cameraId: storeData.videoInput,
              },
              function () {
                Message.message(<div>没有推流权限</div>, undefined, () =>
                  console.log("onClose")
                );
              }
            );
          }
        }
      );
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
        });
      } else {
        this.setState({
          screenStream: stream,
        });
      }
    });

    this.Client.on("screenshare-stopped", (stream) => {
      this.Client.unpublish(stream.sid, (e) => {
        console.log("取消推送共享");
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
      remoteStreams.push(stream);
      this.setState({
        remoteStreams,
        // videoList: this.client.getRemoteStreams()
      });
      
    });

    this.Client.on("stream-removed", (stream) => {
      console.log("stream-removed ", stream);
      const { remoteStreams = [] } = this.state;
      const idx = remoteStreams.findIndex((item) => stream.sid === item.sid);

      if (idx !== -1) {
        remoteStreams.splice(idx, 1);
      }
      this.setState({ remoteStreams });
    });
    this.Client.enableAudioVolumeIndicator(500)
    this.Client.on("volume-indicator", (e) => {
      this.setState({
        remoteVolumeData: e
      })
    });

    this.Client.on("mute-audio", (stream) => {
      console.log(23)
      let muteRemote = this.state.muteRemoteVolume;
      let flag = false;
      muteRemote.map(e=>{
        if(e.sid === stream.sid){
          flag = true;
        }
      })
      if(!flag){
        muteRemote.push(stream);
        this.setState({
          muteRemoteVolume: muteRemote
        })
      }
    });

    this.Client.on("unmute-video", (stream) => {
      // let muteVideoData = this.state.muteRemoteVideo;
      // muteVideoData.map((e,v)=>{
      //   if(e.sid === stream.sid){
      //     muteVideoData.splice(v,1);
      //     this.setState({
      //       muteRemoteVolume: muteRemote
      //     })
      //   }
      // })
      let muteVideoData = this.state.muteRemoteVideo;
      muteVideoData.map((e,v)=>{
        if(e.sid === stream.sid){
          muteVideoData.splice(v,1);
          this.setState({
            muteRemoteVideo: muteVideoData
          })
        }
      })
    });

    this.Client.on("mute-video", (stream) => {
      let muteVideoData = this.state.muteRemoteVideo;
      
      let flag = false;
      muteVideoData.map(e=>{
        if(e.sid === stream.sid){
          flag = true;
        }
      })
      if(!flag){
        muteVideoData.push(stream);
        this.setState({
          muteRemoteVideo: muteVideoData
        })
      }
      
    });

    this.Client.on("unmute-audio", (stream) => {
      let muteRemote = this.state.muteRemoteVolume;
      muteRemote.map((e,v)=>{
        if(e.sid === stream.sid){
          muteRemote.splice(v,1);
          this.setState({
            muteRemoteVolume: muteRemote
          })
        }
      })
    });
  }
  unPublish(){
    this.setState({
      localStream:null
    })
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

  // publish = () => {
  //   const storeData = this.props.store.settings;
  //   sdk.deviceDetection({
  //     audio:true,
  //     video:true
  //   },(Result)=>{
  //     if(Result.audio === false && Result.video === false ){
  //       Message.error("没有可用音视频设备");
  //     }else{
  //       this.Client.publish(
  //         {
  //           audio: Result.audio,
  //           video: Result.video,
  //           cameraId: storeData.videoInput,
  //         },
  //         function () {
  //           Message.message(<div>没有推流权限</div>, undefined, () =>
  //             console.log("onClose")
  //           );
  //         }
  //       );
  //     }
  //   })
    
  // }

  // //下麦操作
  // unPublish = () => {
  //   let { lineFlag, playBtnShow } = this.state;
  //   if (lineFlag) {
  //     this.Client.unpublish((stream) => {
  //       Message.success("下麦成功");
  //       let { localStream } = this.state;
  //       this.setState({
  //         localStream: null,
  //         lineFlag: false,
  //       }, () => {
  //         this.props.store.common.setAudioMuteStats(false);
  //         this.props.store.common.setVideoMuteStats(false);
  //       });

  //       //ios自带浏览重新播放

  //       //ios safari
  //       if(isIOS() && isSafari()){
  //         this.setState({
  //           safariShow:true
  //         })
  //       }
  //     });
  //   } else {
  //     this.publish()
  //     this.setState({
  //       lineFlag: true,
  //     });
  //   }
  // };

  videoChange(e) {
    this.setState({
      currentVideoItem: e,
    });
  }
  render() {
    const {
      localStream,
      remoteStreams,
      screenStream,
      // setVolumeDisplay,
      paramsData,
      volumeData,
      // remoteVolumeData,
      muteRemoteVolume,
      muteRemoteVideo,
      currentVideoItem,
      userName,
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
            <li className={`${
                  "local" === currentVideoItem ? "li-current" : null
                }`}>
              <div
                className={`video-item ${
                  "local" === currentVideoItem ? "video-current" : null
                }`}
              >
                <span
                  className="icon__maximize video-change"
                  title="切换到大屏"
                  onClick={() => this.videoChange("local")}
                ></span>
                    <div
                      className="bg"
                      style={{
                        display: localStream !== null && (localStream.muteVideo || !localStream.video) ? "block" : "none",
                      }}
                    >
                      {/* <img src={bgImg} alt="" /> */}
                    </div>
                <ReactPlayer
                  className="local-video"
                  url={localStream && localStream.mediaStream}
                  muted={true}
                  width="100%"
                  height="100%"
                  playing
                  playsinline
                />
                <div className="video-info">
                  <span className="user-name">{userName}</span>
                  <span className="volume-wrapper">
                    <span className="icon__urtc-mkf"></span>
                    <span
                      className="volume-data"
                      style={{ top: volumeData+'px' }}
                    ></span>
                  </span>
                </div>
              </div>
            </li>
            {remoteStreams.map((stream, key) => (
              <li key={stream.sid}>
                <div
                  className={`video-item ${
                    "remote" + key === currentVideoItem ? "video-current" : null
                  }`}
                >
                  <span
                    className="icon__maximize video-change"
                    title="切换到大屏"
                    onClick={() => this.videoChange("remote" + key)}
                  ></span>
                  <div
                      className="bg"
                      style={{
                        display: localStream !== null && (localStream.muteVideo || !localStream.video) ? "block" : "none",
                      }}
                    >
                      {/* <img src={bgImg} alt="" /> */}
                    </div>
                  <ReactPlayer
                    className="remote-video"
                    url={stream && stream.mediaStream}
                    width="100%"
                    height="100%"
                    playing
                    playsinline
                  />
                  <div className="video-info">
                    <span className="user-name">{stream.uid}</span>
                    <span className={`volume-wrapper ${muteRemoteVolume.map(e=>{if(e.sid===stream.sid){
                      return 'mute-audio'
                    }})}`}>
                      <span className="icon__urtc-mkf"></span>
                      {/* {remoteVolumeData.map((data,i)=>(
                        <span
                          className="volume-data"
                          key={i}
                          style={{ top: data.sid === stream.sid? 14 - Math.ceil((data.volume / 100) * 8)+'px':'14px' }}
                        ></span>
                      ))} */}
                    </span>
                    <span className={`volume-wrapper ${muteRemoteVideo.map(e=>{if(e.sid===stream.sid){
                      return 'mute-audio'
                    }})}`}>
                      <span className="icon__urtc-sxj"></span>
                    </span>
                  </div>
                </div>
              </li>
            ))}
            {screenStream && screenStream.mediaStream ? (
              <li>
                <div
                  className={`video-item ${
                    "screen" === currentVideoItem ? "video-current" : null
                  }`}
                >
                  <span
                    className="icon__maximize video-change"
                    title="切换到大屏"
                    onClick={() => this.videoChange("screen")}
                  ></span>
                  <ReactPlayer
                    className="local-video"
                    url={screenStream.mediaStream}
                    width="100%"
                    height="100%"
                    playing
                    playsinline
                  />
                </div>
              </li>
            ) : null}
          </ul>
        </div>

        <ClassFooter
          client={this.Client}
          paramsData={paramsData}
          unPublish={this.unPublish}
          sid={localStream && localStream.sid}
        />
        {/* <SafariHelpModal
          show={safariShow}
          close={() => {
            this.setState({ safariShow: false });
          }}
          play={this.playStreams}
        /> */}

      </div>
    );
  }
}

export default ClassRoom;

