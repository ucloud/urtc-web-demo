import {
    observable,
    action,
    // computed
  } from "mobx";
  // import config from "../config";
  class Client {
    @observable clientData = null;//录制的
  
      @action 
      initClient(e){
          this.clientData = e;
      }
  
    // @computed
    // get allSettingData (){
    //     return ''
    // }
  }
  
  export default Client;
  