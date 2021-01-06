import React from "react";
import { observer, inject } from "mobx-react";
import sdk from "urtc-sdk";
import "./settings.css";
import { Modal, Input, Form, Select } from "@ucloud-fe/react-components";
import config from "../config";
import { isPC } from "../util/index";
const { isSupportWebRTC } = sdk;
const { Item } = Form;
const { Option } = Select;
const itemLayout = {
  labelCol: {
    span: 2,
  },
  controllerCol: {
    span: 10,
  },
};

@inject("store")
@observer
class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      visible: false,
      initData: {
        roomType: "rtc", //房间类型
        userRole: "push-and-pull", //用户角色
        userName: "", //用户名
        userId: "", //id
        videoInput: "", //摄像头
        audioInput: "default", //麦克风
        audioOutput: "default", //扬声器
        videoProlie: "640*360", //视频分辨率
        desktopProfile: "1280*720",
        videoCodec: "vp8", //视频编码
        AppKey: config.AppKey, //AppKey
        AppId: config.AppId, //AppId
        apiLink: '',
        logLink: '',
        signalLink: ''
      },
      videoInputList: [],
      audioInputList: [],
      audioOutputList: [],
      videoProlieList: [],
      videoCodecList: [],
      AppKey: config.AppKey, //AppKey
      AppId: config.AppId, //AppId
      isPhone: !isPC(),
    };
    this.setClose = this.setClose.bind(this);
    this.roomTypeChange = this.roomTypeChange.bind(this);
    this.userRoleChange = this.userRoleChange.bind(this);
    this.setOk = this.setOk.bind(this);
    this.userNameChange = this.userNameChange.bind(this);
    this.videoInputChange = this.videoInputChange.bind(this);
    this.audioInputChange = this.audioInputChange.bind(this);
    this.audioOutputChange = this.audioOutputChange.bind(this);
    this.videoProlieChange = this.videoProlieChange.bind(this);
    this.videoCodecChange = this.videoCodecChange.bind(this);
    this.AppKeyChange = this.AppKeyChange.bind(this);
    this.AppIdChange = this.AppIdChange.bind(this);
    this.apiLinkChange = this.apiLinkChange.bind(this);
    this.logLinkChange = this.logLinkChange.bind(this);
    this.signalLinkChange = this.signalLinkChange.bind(this);
  }
  componentDidMount() {
    this.getDeviceData();
    this.getSupportProfile();
    this.getSupportedCodec();
    const initData = this.state.initData;
    this.setState({
      signalLink: initData.signalLink
    });
  }
  componentWillReceiveProps(nextProps) {
    let storeSettings = this.props.store.settings;
    const initData = this.state.initData;
    this.setState({
      setVisible: storeSettings.setVisible,
      initData: { ...initData, userId: storeSettings.userId },
    });
  }

  getSupportedCodec() {
    sdk.getSupportedCodec((e) => {
      this.setState({
        videoCodecList: e.video,
      });
    });
  }
  getSupportProfile() {
    this.setState({
      videoProlieList: sdk.getSupportProfileNames(),
    });
  }
  getDeviceData() {
    let _this = this;
    let videoInput = [];
    let audioInput = [];
    let audioOutput = [];
    sdk.getDevices((e) => {
      e.forEach(function (data) {
        if (data.kind === "videoinput") {
          console.log("device info ", data);
          videoInput.push(data);
        } else if (data.kind === "audioinput") {
          audioInput.push(data);
        } else if (data.kind === "audiooutput") {
          audioOutput.push(data);
        }
      });

      let storeSettings = this.props.store.settings;
      console.log("videoInput[0].deviceId", videoInput[0].deviceId);
      storeSettings.setParamKey("videoInput", videoInput[0].deviceId);

      const initData = _this.state.initData;
      this.setState({
        videoInputList: videoInput,
        audioInputList: audioInput,
        audioOutputList: audioOutput,
        initData: { ...initData, videoInput: videoInput[0].deviceId },
      });
    });
  }
  setClose() {
    this.setState({
      setVisible: false,
    });
    let storeSettings = this.props.store.settings;
    storeSettings.settingsActive(false);
    // console.log(this.props)
    // this.props.visible(false)
  }
  roomTypeChange(e) {
    const initData = this.state.initData;
    if (e === "rtc") {
      console.log("roomTypeChange", e);
      this.setState({
        initData: { ...initData, userRole: "push-and-pull", roomType: e },
      });
      let storeSettings = this.props.store.settings;
      storeSettings.setParamKey("userRole", "push-and-pull");
      storeSettings.setParamKey("roomType", e);
    } else {
      let storeSettings = this.props.store.settings;
      storeSettings.setParamKey("roomType", e);
      this.setState({
        initData: { ...initData, roomType: e },
      });
    }
  }
  userRoleChange(e) {
    const initData = this.state.initData;
    let storeSettings = this.props.store.settings;
    storeSettings.setParamKey("userRole", e);
    this.setState({
      initData: { ...initData, userRole: e },
    });
  }
  userNameChange(e) {
    const initData = this.state.initData;
    let storeSettings = this.props.store.settings;
    storeSettings.setParamKey("userName", e.target.value);
    this.setState({
      initData: { ...initData, userName: e.target.value },
    });
  }
  videoInputChange(e) {
    const initData = this.state.initData;
    let storeSettings = this.props.store.settings;
    storeSettings.setParamKey("videoInput", e);
    this.setState({
      initData: { ...initData, videoInput: e },
    });
  }
  audioInputChange(e) {
    const initData = this.state.initData;
    let storeSettings = this.props.store.settings;
    storeSettings.setParamKey("audioInput", e);
    this.setState({
      initData: { ...initData, audioInput: e },
    });
  }
  audioOutputChange(e) {
    const initData = this.state.initData;
    let storeSettings = this.props.store.settings;
    storeSettings.setParamKey("audioOutput", e);
    this.setState({
      initData: { ...initData, audioOutput: e },
    });
  }
  videoProlieChange(e) {
    const initData = this.state.initData;
    let storeSettings = this.props.store.settings;
    storeSettings.setParamKey("videoProlie", e);
    this.setState({
      initData: { ...initData, videoProlie: e },
    });
  }
  desktopProlieChange = (e) => {
    const initData = this.state.initData;
    let storeSettings = this.props.store.settings;
    storeSettings.setParamKey("desktopProfile", e);
    this.setState({
      initData: { ...initData, desktopProfile: e },
    });
  };
  videoCodecChange(e) {
    const initData = this.state.initData;
    let storeSettings = this.props.store.settings;
    storeSettings.setParamKey("videoCodec", e);
    this.setState({
      initData: { ...initData, videoCodec: e },
    });
  }
  AppKeyChange(e) {
    const initData = this.state.initData;
    let storeSettings = this.props.store.settings;
    storeSettings.setParamKey("AppKey", e.target.value);
    this.setState({
      initData: { ...initData, AppKey: e.target.value },
      AppKey: e.target.value,
    });
  }
  userIdChange = (e) => {
    const initData = this.state.initData;
    let storeSettings = this.props.store.settings;
    storeSettings.setParamKey("userId", e.target.value);
    this.setState({
      initData: { ...initData, userId: e.target.value },
    });
  };

  AppIdChange(e) {
    const initData = this.state.initData;
    let storeSettings = this.props.store.settings;
    storeSettings.setParamKey("AppId", e.target.value);
    this.setState({
      initData: { ...initData, AppId: e.target.value },
      AppId: e.target.value,
    });
  }
  setOk() {
    let initData = this.state.initData;
    let storeSettings = this.props.store.settings;
    storeSettings.settingsData(initData);
    storeSettings.settingsActive(false);
    this.setState({
      setVisible: false,
    });
  }
  apiLinkChange(e) {
    const initData = this.state.initData;
    let storeSettings = this.props.store.settings;
    storeSettings.setParamKey("apiLink", e.target.value);
    this.setState({
      initData: { ...initData, apiLink: e.target.value },
    });
  }
  logLinkChange(e) {
    const initData = this.state.initData;
    let storeSettings = this.props.store.settings;
    storeSettings.setParamKey("logLink", e.target.value);
    this.setState({
      initData: { ...initData, logLink: e.target.value },
    });
  }
  signalLinkChange(e) {
    const initData = this.state.initData;
    let storeSettings = this.props.store.settings;
    storeSettings.setParamKey("signalLink", e.target.value);
    console.log(e.target.value)
    this.setState({
      signalLink: e.target.value,
      initData: { ...initData, signalLink: e.target.value },
    });
  }
  render() {
    const {
      videoInputList,
      audioInputList,
      audioOutputList,
      videoProlieList,
      videoCodecList,
      AppId,
      AppKey,
      setVisible,
      isPhone,
      signalLink
    } = this.state;
    // console.log(this.props.store.settings.roomType)
    // const { settings,Settings } = this.props.store;
    let { settings } = this.props.store;
    console.log("settings.videoInput", settings.videoInput);
    //输出视频输入数据
    return (
      <Modal
        visible={setVisible}
        size="md"
        onClose={this.setClose}
        onOk={this.setOk}
        className="setting-modal"
      >
        <Form className="settings">
          <Item label="房间类型：" {...itemLayout}>
            <Select
              value={settings.roomType}
              disabled={!isSupportWebRTC()}
              onChange={this.roomTypeChange}
            >
              <Option value={"rtc"}>小班课</Option>
              <Option value={"live"}>大班课</Option>
            </Select>
          </Item>
          <Item label="用户角色：" {...itemLayout}>
            <Select
              value={settings.userRole}
              disabled={!isSupportWebRTC()}
              onChange={this.userRoleChange}
            >
              {settings.roomType !== "rtc" ? (
                <Option value={"push"}>推流</Option>
              ) : null}
              {settings.roomType !== "rtc" || !isSupportWebRTC() ? (
                <Option value={"pull"}>拉流</Option>
              ) : null}

              <Option value={"push-and-pull"}>推流+拉流</Option>
            </Select>
          </Item>
          {/* <Item label="用户名：" {...itemLayout}>
            <Input onChange={this.userNameChange} />
          </Item> */}
          <Item label="用户ID：" {...itemLayout}>
            <Input value={settings.userId} onChange={this.userIdChange} />
          </Item>
          <Item label="摄像头：" {...itemLayout}>
            <Select
              value={settings.videoInput}
              onChange={this.videoInputChange}
            >
              {videoInputList.map((v, i) => (
                <Option key={i} value={v.deviceId}>
                  {v.label}
                </Option>
              ))}
            </Select>
          </Item>
          <Item label="麦克风：" {...itemLayout}>
            <Select
              value={settings.audioInput}
              onChange={this.audioInputChange}
            >
              {audioInputList.map((v, i) => (
                <Option key={i} value={v.deviceId}>
                  {v.label}
                </Option>
              ))}
            </Select>
          </Item>
          <Item label="扬声器：" {...itemLayout}>
            <Select
              value={settings.audioOutput}
              onChange={this.audioOutputChange}
            >
              {audioOutputList.map((v, i) => (
                <Option key={i} value={v.deviceId}>
                  {v.label}
                </Option>
              ))}
            </Select>
          </Item>
          <Item label="分辨率：" {...itemLayout}>
            <Select
              value={settings.videoProlie}
              onChange={this.videoProlieChange}
            >
              {videoProlieList.map((v, i) => (
                <Option key={i} value={v}>
                  {v}
                </Option>
              ))}
            </Select>
          </Item>
          {isPhone ? null : (
            <Item label="桌面分辨率：" {...itemLayout}>
              <Select
                value={settings.desktopProfile}
                onChange={this.desktopProlieChange}
              >
                {videoProlieList.map((v, i) => (
                  <Option key={i} value={v}>
                    {v}
                  </Option>
                ))}
              </Select>
            </Item>
          )}

          <Item label="视频格式：" {...itemLayout}>
            <Select
              value={settings.videoCodec}
              onChange={this.videoCodecChange}
            >
              {videoCodecList.map((v, i) => (
                <Option key={i} value={v}>
                  {v}
                </Option>
              ))}
            </Select>
          </Item>
          <Item label="AppId：" {...itemLayout}>
            <Input value={AppId} onChange={this.AppIdChange} />
          </Item>
          <Item label="AppKey：" {...itemLayout}>
            <Input
              value={AppKey}
              onChange={this.AppKeyChange}
              type="password"
            />
          </Item>
          <Item label="私有部署地址：" {...itemLayout}>
            <Input placeholder="例如：wss://domain:5005" style={{ width: '200px' }} value={signalLink} onChange={this.signalLinkChange} />
          </Item>
          {/* <Group title="">
            <Item label="房间地址" {...itemLayout}>
                <Input placeholder="例如：wss://domain:5005" style={{width:'200px'}} value={apiLink} onChange={this.apiLinkChange} />
            </Item>
            <Item label="日志地址" {...itemLayout}>
                <Input style={{width:'200px'}} value={logLink} onChange={this.logLinkChange} />
            </Item>
        </Group> */}
        </Form>
      </Modal>
    );
  }
}

export default Settings;
