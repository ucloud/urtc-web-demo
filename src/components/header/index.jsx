import React from "react";
import styled from "styled-components";
import { Icon } from "@ucloud-fe/react-components";
import { observer, inject } from "mobx-react";

const statusMap = {
  0: {
    status: "未知",
    color: "#fff",
  },
  1: {
    status: "优秀",
    color: "rgb(129 234 134)",
  },
  2: {
    status: "良好",
    color: "rgb(129 234 134)",
  },
  3: {
    status: "一般",
    color: "rgb(82 148 85)",
  },
  4: {
    status: "较差",
    color: "rgb(224 191 92)",
  },
  5: {
    status: "糟糕",
    color: "rgb(244 67 54)",
  },
  6: {
    status: "rgb(177 175 175)",
    color: "",
  },
  default: {
    status: "未知",
    color: "#fff",
  },
};

const Header = styled.div`
  position: relative;
  height: 36px;
  line-height: 36px;
  text-align: left;
  box-sizing: border-box;
  background-color: #2f3238;
  .room-info {
    display: inline-block;
    .roomId,
    .userName {
      display: inline-block;
      font-size: 12px;
      padding: 0 28px;
      border-right: 1px solid #41454c;
    }
    .roomId {
    }
    .userName {
    }
  }
`;
const Network = styled.div`
  display: inline-block;
  margin-left: 38px;
  font-size: 18px;
  cursor: pointer;
  color: rgb(12, 131, 12);
  .text {
    color: #fff;
    display: inline-block;
    padding-left: 4px;
    font-size: 14px;
  }
`;

/**
 * @param client sdk实例
 */

@inject("store")
@observer
class ClassHeader extends React.Component {
  static defaultProps = {};

  state = {
    uplink: "",
    downlink: "",
    linkColor: "#fff",
    paramsData: {},
    rtt: 0,
  };

  componentDidMount() { }

  componentWillReceiveProps(nextProps) {
    if (nextProps.client && !this.isWatching) {
      this.Client = nextProps.client;
      this.isWatching = true;
      this.getNetwork();
      this.setState({
        paramsData: nextProps.paramsData,
      });
    }
  }

  getNetwork = () => {
    console.log("???start");
    this.Client.on("network-quality", (Stats) => {
      if (Stats.uplink) {
        this.setState({
          uplink: statusMap[Stats.uplink].status,
          linkColor: statusMap[Stats.uplink].color,
        });
      } else {
        this.setState({
          uplink: statusMap[Stats.default].status,
          linkColor: statusMap[Stats.default].color,
        });
      }
    });
    this.timer = setInterval(() => {
      this.Client.getNetworkStats(
        (stats) => {
          this.setState({
            rtt: stats.rtt,
          });
        },
        (error) => {
          clearInterval(this.timer);
          console.log(error);
        }
      );
    }, 200);
  };

  render() {
    const { uplink, linkColor, rtt } = this.state;
    return (
      <Header className="video-header">
        <div className="room-info">
          <span className="roomId">
            房间号：<b>{this.props.store.settings.roomId}</b>
          </span>
          <span className="userName">
            {" "}
            用户名：<b> {this.props.store.settings.userId}</b>
          </span>
        </div>

        <Network className="network">
          <Icon
            style={{ color: linkColor }}
            title={`网络状态：${uplink}`}
            type="bar-graph"
          />
          <span className="text">{`${rtt}ms`}</span>
        </Network>
      </Header>
    );
  }
}

export default ClassHeader;
