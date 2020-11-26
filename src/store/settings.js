import {
  observable,
  action,
  // computed
} from "mobx";
import config from "../config";
import { randNum } from "../util/index";
import { setCookie } from "../util/cookie";

class Settings {
  @observable roomId = ""; //房间号
  @observable userId = randNum(8); //用户ID
  @observable roomType = "rtc"; //房间类型
  @observable userRole = "push-and-pull"; //用户角色
  @observable userName = "default"; //用户名
  @observable videoInput = ""; //摄像头
  @observable audioInput = "default"; //麦克风
  @observable audioOutput = "default"; //扬声器
  @observable videoProlie = "640*360"; //分辨率
  @observable videoCodec = "vp8"; //视频编码格式
  @observable AppKey = config.AppKey; //AppKey
  @observable AppId = config.AppId; //AppID
  @observable setVisible = false;
  @observable desktopProfile = "1280*720"; //分享桌面分辨率
  @observable apiLink = "";
  @observable logLink = "";
  @observable signalLink = "";
  

  @action
  settingsData(obj) {
    this.roomType = obj.roomType;
    this.userRole = obj.userRole;
    this.userName = obj.userName;
    this.videoInput = obj.videoInput;
    this.audioInput = obj.audioInput;
    this.audioOutput = obj.audioOutput;
    this.videoProlie = obj.videoProlie;
    this.videoCodec = obj.videoCodec;
    this.AppKey = obj.AppKey;
    this.AppId = obj.AppId;
    this.userId = obj.userId;
    this.desktopProfile = obj.desktopProfile;
    this.apiLink = obj.apiLink;
    this.logLink = obj.logLink;
    this.signalLink = obj.signalLink;
  }

  settingsActive(e) {
    this.setVisible = e;
  }

  setParamKey(key, value) {
    this[key] = value;
  }

  joinRoom(obj) {
    let settingParam = {
      roomId: obj.roomId,
      roomType: this.roomType,
      userRole: this.userRole,
      userName: this.userName,
      videoInput: this.videoInput,
      audioInput: this.audioInput,
      audioOutput: this.audioOutput,
      videoProlie: this.videoProlie,
      videoCodec: this.videoCodec,
      AppKey: this.AppKey,
      AppId: this.AppId,
      userId: this.userId,
      desktopProfile: this.desktopProfile,
      apiLink : this.apiLink,
      logLink : this.logLink,
      signalLink : this.signalLink
    };
    setCookie("settingParam", JSON.stringify(settingParam));
    this.roomId = obj.roomId;
  }
  // @computed
  // get allSettingData (){
  //     return ''
  // }
}

export default Settings;
