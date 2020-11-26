import React, { useState, useEffect } from "react";
import { Icon } from "@ucloud-fe/react-components";
import { observer, useLocalStore } from "mobx-react";
import { settings } from "../../store/index"
import { Network, Header } from './new.styles.jsx' //样式组件
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
/**
 * @param client sdk实例
 */

const ClassHeader = observer((props) => {
    const localStore = useLocalStore(() => settings)
    const [uplink, setUplink] = useState("");
    const [linkColor, setLinkColor] = useState("#fff");
    const [rtt, setRtt] = useState(0);
    useEffect(() => {
        if (props.client == null || !props.sid) return
        function getNetwork() {
            props.client.on("network-quality", (Stats) => {

                if (Stats.uplink) {
                    setUplink(statusMap[Stats.uplink].status)
                    setLinkColor(statusMap[Stats.uplink].color)
                } else {
                    setUplink(statusMap[Stats.default].status)
                    setLinkColor(statusMap[Stats.default].color)
                }
            });
            let timer = setInterval(() => {
                props.client.getNetworkStats(
                    (stats) => {
                        setRtt(stats.rtt)
                    },
                    (error) => {
                        clearInterval(timer);
                        console.log(error);
                    }
                );
            }, 200);
        }
        getNetwork();
    });
    return (
        <Header className="video-header">
            <div className="room-info">
                <span className="roomId">
                    房间号：<b>{localStore.roomId}</b>
                </span>
                <span className="userName">
                    {" "}
                    用户名：<b> {localStore.userId}</b>
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
})
export default ClassHeader;