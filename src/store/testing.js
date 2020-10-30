import { observable, action } from "mobx";
class TestingStore {
  @observable sdkClient = null;

  @action
  setSdkClient(obj) {
    this.sdkClient = obj;
  }

  // @computed
  // get allSettingData (){
  //     return ''
  // }
}

export default TestingStore;
