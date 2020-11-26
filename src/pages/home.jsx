import React from "react";
import { observer, inject } from "mobx-react";
import { Icon, Row, Col, Button, Message } from "@ucloud-fe/react-components";
import Settings from "../components/settings";
import Testing from "../components/testing/index";
import bgImg from "../common/image/com.png";
import { version } from "../config/version";
import Querystringify from "querystringify";
import { isPC, isSafari } from "../util/index";
import { LoginWrapper } from './home.styles.jsx';
import SDK from "urtc-sdk";
import "./login.css";
const { isSupportWebRTC } = SDK;


@inject("store")
@observer
class Login extends React.Component {
  constructor(props) {
    super(props);
    let storeSettings = this.props.store.settings;
    const query = Querystringify.parse(props.location.search);
    console.log("query", query);
    const { roomId = "", roomType = "rtc" } = query;
    if (roomId) {
      storeSettings.joinRoom({
        roomId: roomId,
      });
    }
    if (roomType === "live") {
      storeSettings.setParamKey("roomType", "live");
      storeSettings.setParamKey("userRole", "pull");
    }

    //不支持rtc，统一权限改为拉流pull
    if (!isSupportWebRTC()) {
      storeSettings.setParamKey("userRole", "pull");
    }

    this.state = {
      loading: false,
      setVisible: true,
      roomIdValue: roomId,
      testingVisible: false,
      isPhone: !isPC(),
      supportRTC: isSupportWebRTC(),
    };
  }

  componentDidMount() {
    if (!this.state.supportRTC) {
      Message.error("当前浏览器不支持RTC推流，建议更换Safari 或 Chrome 重试");
    }
  }
  joinIn = () => {
    let roomId = this.state.roomIdValue;
    let storeSettings = this.props.store.settings;

    console.log("storeSettings,", storeSettings);
    let userId = storeSettings.userId;
    this.props.history.push({
      pathname: "/class",
      state: { roomId: roomId, userId: userId },
    });
    storeSettings.joinRoom({
      roomId: roomId,
      userId: userId,
    });
  };

  setting = () => {
    this.setState({
      setVisible: true,
    });
    let storeSettings = this.props.store.settings;
    storeSettings.settingsActive(true);
  };

  roomId = (e) => {
    this.setState({
      roomIdValue: e.target.value,
    });
    console.log(e.target.value);
  };

  setClose() {
    this.setState({
      setVisible: false,
      
    });
  }

  toggleTesting = (flag) => {
    this.setState({
      testingVisible: flag,
    });
  };

  render() {
    const { setVisible, testingVisible, roomIdValue, isPhone } = this.state;
    console.log("isSupportWebRTC", isSupportWebRTC());
    return (
      <LoginWrapper
        className="login"
        width={isPhone ? 300 : 512}
        isPhone={isPhone}
      >
        <div className="setting-content">
          <div className="header">
            <div className="header_left">
              <div className="header_Icon">
                <a
                  href="https://www.ucloud.cn/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={bgImg} alt="" />
                </a>
              </div>
            </div>
            <div className="header_right">
              <Icon onClick={this.setting} type={"cog"} />
              <Settings visible={setVisible} />
            </div>
          </div>

          <div className="main">
            <Row getter={0}>
              <Col span={5}>
                <p className="title-left">房间号码</p>
              </Col>
              <Col span={4} offset={3}>
                {(isPhone || isSafari()) ? null : (
                  <p
                    className="title-right"
                    onClick={this.toggleTesting.bind(this, true)}
                  >
                    检测{" "}
                    <span
                      className="title_icon icon__arrow-right"
                    // type="arrow-right"
                    />
                  </p>
                )}

                {testingVisible && (
                  <Testing
                    show={testingVisible}
                    close={this.toggleTesting.bind(this, false)}
                  />
                )}
              </Col>
            </Row>
            <div>
              <input
                value={roomIdValue}
                type="text"
                className="room-id"
                onChange={this.roomId}
              />
            </div>
            <div className="btn-content">
              <Button
                className="btn"
                styleType="primary"
                size="lg"
                onClick={this.joinIn}
              >
                {"加入"}
              </Button>
            </div>
          </div>
          <div className="version-wrapper">
            <span>{`URTC DEMO : ${version}`}</span>
          </div>
        </div>
      </LoginWrapper>
    );
  }
}

export default Login;
