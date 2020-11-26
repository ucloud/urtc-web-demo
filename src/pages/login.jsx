import React from "react";
import { observer, inject } from "mobx-react";
import "./login.css";
import Settings from "../components/settings";
import Testing from "../components/testing/index";
import { randNum } from "../util";

// import { Modal } from "@ucloud-fe/react-components";
@inject("store")
@observer
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      setVisible: false,
      roomIdValue: "",
      testingVisible: false,
    };
    this.joinIn = this.joinIn.bind(this);
    this.setting = this.setting.bind(this);
    this.roomId = this.roomId.bind(this);
  }

  componentDidMount() {
    // store.dispatch(userLogin('2ds2e23e211'));
    // console.log(store.getState())
  }
  joinIn() {
    let roomId = this.state.roomIdValue;
    let userId = randNum(8);
    console.log(userId);
    this.props.history.push({
      pathname: "/class",
      state: { roomId: roomId, userId: userId },
    });
    let storeSettings = this.props.store.settings;
    storeSettings.joinRoom({
      roomId: roomId,
    });
  }

  setting() {
    this.setState({
      setVisible: true,
    });
    let storeSettings = this.props.store.settings;
    storeSettings.settingsActive(true);
    // console.log('1111111',e)
  }

  roomId(e) {
    this.setState({
      roomIdValue: e.target.value,
    });
  }

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
    const { setVisible, testingVisible } = this.state;
    return (
      <div className="login">
        <div className="login-wrapper">
          <input type="text" className="room-id" onChange={this.roomId} />
          <button className="join-in" onClick={this.joinIn}>
            加入房间
          </button>
          <div className="active-btn">
            <button className="setting" onClick={this.setting}>
              设置
            </button>
            <button
              className="detecting"
              onClick={this.toggleTesting.bind(this, true)}
            >
              检测
            </button>
          </div>
        </div>
        <Settings visible={setVisible} />
        {testingVisible && (
          <Testing
            show={testingVisible}
            close={this.toggleTesting.bind(this, false)}
          />
        )}
      </div>
    );
  }
}

export default Login;
