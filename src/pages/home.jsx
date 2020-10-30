import React from "react";
import { observer, inject } from "mobx-react";
import styled from "styled-components";
import "./login.css";
import { Icon, Row, Col, Button, Message } from "@ucloud-fe/react-components";
import Settings from "../components/settings";
import Testing from "../components/testing/index";
import bgImg from "../common/image/com.png";
import { version } from "../config/version";
import Querystringify from "querystringify";
import { isPC, isSafari } from "../util/index";
import SDK from "urtc-sdk";
const { isSupportWebRTC } = SDK;
require("@ucloud/ucloud-icons/dist/css/icon.min.css");

const LoginWrapper = styled.div`
  height: 100vh;
  width: 100vw;
  /* min-width: 1440px; */
  min-height: 375x;
  background: #121f37;
  border-radius: 4px;
  position: relative;
  text-align: center;
  display: flex;
  display: -webkit-flex; /* Safari */
  .version-wrapper {
    width: 100%;
    height: 20px;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    color: #7a8baa;
    line-height: 20px;
    text-align: center;
    padding-top: 77px;
  }
  .setting-content {
    display: inline-block;
    margin: 0 auto;
    width: ${(props) => (props.width ? props.width + "px" : "512px")};
    height: 360px;
    background: #eff2f5;
    border-radius: 4px;
    box-sizing: border-box;
    align-self: center;

    .header {
      margin: 28px 0 0 0;
      position: relative;
      text-align: left;
      padding: 0 20px;
      .header_left,
      .header_right {
        display: inline-block;
        .header_Icon {
          cursor: pointer;
          img {
            height: 14px;
          }
        }
      }

      .header_right {
        position: absolute;
        font-size: 16px;
        top: 0;
        right: 20px;
        color: #526075;
        cursor: pointer;
      }
    }

    .main {
      padding: 44px 0 0 0;
      width: 224px;
      display: inline-block;
      .btn-content {
        width: 100%;
        padding: 24px 0 0 0;
        .btn {
          width: 100%;
          height: 40px;
        }
      }
      .title-left {
        height: 22px;
        font-size: ${(props) => (props.isPhone ? "14px" : " 16px")};
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 600;
        color: #0a1633;
        text-align: left;
        line-height: 22px;
      }
      .title-right {
        height: 20px;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #526075;
        line-height: 26px;
        text-align: right;
        cursor: pointer;
        .title_icon {
          color: #3860f4;
        }
      }
      .room-id {
        width: 100%;
        height: 40px;
        line-height: 40px;
        box-sizing: border-box;
        padding-left: 8px;
        background: #fff;
        color: #445073;
        /* font-weight: bold; */
      }
    }
  }
`;

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
