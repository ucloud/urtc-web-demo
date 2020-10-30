import {
  observable,
  action,
  // computed
} from "mobx";
// import config from "../config";
class Record {
  @observable recordVisible = false; //录制的
  @observable url = null; //录制的

  @action
  recordStart(e) {
    this.recordVisible = e;
  }

  setUrl(e) {
    this.url = e;
  }

  // @computed
  // get allSettingData (){
  //     return ''
  // }
}

export default Record;
