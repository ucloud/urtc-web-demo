import { observable, action } from "mobx";
class Common {
  @observable localMuteVideo = false;
  @observable localMuteAudio = false;
  @observable globalMuteAudioStats = false;

  @action
  setVideoMuteStats(bool) {
    this.localMuteVideo = bool;
  }

  setAudioMuteStats(bool) {
    this.localMuteAudio = bool;
  }

  setGlobalMuteAudioStats(bool) {
    this.globalMuteAudioStats = bool;
  }
  // @computed
  // get allSettingData (){
  //     return ''
  // }
}

export default Common;
