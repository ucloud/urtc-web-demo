import React from "react";
import styled from "styled-components";
import {
  Modal,
  Message,
  Form,
  Input,
  Button,
} from "@ucloud-fe/react-components";
import { observer, inject } from "mobx-react";
import { isPC, copy } from "../../util/index";

/**,
 * @param show  bool 必传，控制组件现实隐藏
 * @param client  rtc事例化对象
 * @param close fun 必传, 关闭modal函数
 * @param param obj 相关参数
 * @description 设备检测模块包含：rtc能力测试，音视频设备状态测试
 */

// 样式
const Wrapper = styled.div`
  position: relative;
  height: 100%;
  padding: 20px;
`;
const { Item } = Form;

//模块
@inject("store")
@observer
class RtcRelay extends React.Component {
  static defaultProps = {
    show: false,
  };

  state = {
    relayLoading: false,
    relayFlag   : false,
    url         : "",
    defaultUrl  : "",
    playUrl     : "",
    isPhone     : !isPC(),
  };

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    if (nextProps.client && !this.isWatching) {
      let { roomId } = nextProps.param;
      let _url = encodeURIComponent(roomId);
      this.Client = nextProps.client;
      this.isWatching = true;
      this.setState({
        url: `rtmp://rtcpush.ugslb.com/rtclive/${_url}`,
      });
    }
  }

  closeModal = () => {
    this.props.close && this.props.close(false);
  };

  startRelay = () => {
    let { roomId } = this.props.param;
    if (!roomId) {
      Message.error("RoomId为空，请重新加入并重试");
      return;
    }

    let _url = encodeURIComponent(roomId);

    this.setState({
      relayLoading: true,
    });
    setTimeout(() => {
      this.Client.startMix(
        {
          type: "relay",
          pushURL: [`rtmp://rtcpush.ugslb.com/rtclive/${_url}`],
        },
        (Err, Result) => {
          if (!Err) {
            this.setState({
              relayFlag: true,
              relayLoading: false,
              playUrl: `http://rtchls.ugslb.com/rtclive/${_url}.m3u8`,
            });
            Message.success("转推成功");
            console.log(
              "转推成功 >>>",
              `rtmp://rtcpush.ugslb.com/rtclive/${_url}`,
              Result
            );
          } else {
            this.setState({
              relayLoading: false,
            });
            Message.error("转推失败");
            console.log(
              "转推失败 >>>",
              `rtmp://rtcpush.ugslb.com/rtclive/${_url}`,
              Err
            );
          }
        }
      );
    }, 6000);
  };

  copyUrl = () => {
    copy(this.state.playUrl);
    Message.success("播放地址以复制");
  };

  setUrl = (e) => {
    if (!e.target.value) return;
    this.setState({
      url: e.target.value,
    });
  };

  stopRelay = () => {
    this.setState({
      relayLoading: true,
    });
    this.Client.stopRelay((Error, Result) => {
      if (!Error) {
        Message.info("停止成功");
        this.props.statsRefush();
        this.setState({
          relayLoading: false,
          relayFlag: false,
        });
        console.log("停止成功", Result);
      } else {
        Message.error("停止失败");
        this.setState({
          relayLoading: false,
        });
      }
    });
  };

  render() {
    const { show } = this.props;
    const { relayLoading, url, relayFlag, playUrl, isPhone } = this.state;
    const itemLayout = {
      labelCol: {
        span: isPhone ? 3 : 2,
      },
      controllerCol: {
        span: isPhone ? 7 : 10,
      },
    };
    return (
      <Modal
        visible={show}
        title={"转推配置"}
        size={isPhone ? "sm" : "md"}
        onClose={this.closeModal}
        // afterClose={this.destroyAll}
        destroyOnClose={false}
        footer={
          <div>
            <Button onClick={this.closeModal}>取消</Button>
            {!relayFlag ? (
              <Button
                styleType="primary"
                onClick={this.startRelay}
                loading={relayLoading}
                style={{ marginLeft: "12px" }}
              >
                {!relayLoading ? "开始转推" : "转推中"}
              </Button>
            ) : (
              <Button
                styleType="primary"
                onClick={this.stopRelay}
                loading={relayLoading}
                style={{ marginLeft: "12px" }}
              >
                {!relayLoading ? "停止转推" : "转推中"}
              </Button>
            )}
          </div>
        }
      >
        <Wrapper isPhone={isPhone}>
          <Form className="relay">
            <Item label={!relayFlag ? "转推地址" : "播放地址"} {...itemLayout}>
              {!relayFlag ? (
                <Input
                  style={{ width: isPhone ? "200px" : "260px" }}
                  value={url}
                  onChange={this.setUrl}
                  placeholder="如不填，则为默认地址转推"
                />
              ) : (
                <>
                  <p> {playUrl}</p>
                  <Button
                    styleType="primary"
                    onClick={this.copyUrl}
                    style={{ marginLeft: "12px" }}
                  >
                    {"复制播放地址"}
                  </Button>
                </>
              )}
            </Item>
          </Form>
        </Wrapper>
      </Modal>
    );
  }
}

export default RtcRelay;
