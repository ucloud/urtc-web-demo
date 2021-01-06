import React, { useState, useEffect } from "react";
import { Icon } from "@ucloud-fe/react-components";
import { observer, useLocalStore } from "mobx-react";
import { settings } from "../../store/index"
import { Network, Header, statusMap } from './new.styles.jsx' //样式组件以及配置字典
import icon_duanwang from '../../common/image/duanwang.png'
/**
 * @param client sdk实例
 */

const ClassHeader = observer((props) => {
    const localStore = useLocalStore(() => settings)
    const [uplink, setUplink] = useState("");
    const [upNum, setNum] = useState(0);
    const [linkColor, setLinkColor] = useState("#fff");
    const [rtt, setRtt] = useState(0);
    useEffect(() => {
        if (props.client == null || !props.sid) return
        function getNetwork() {
            props.client.on("network-quality", (Stats) => {
                setNum(Stats.uplink)
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
                {upNum !== "6" ?
                    <div>
                        <Icon
                            style={{ color: linkColor }}
                            title={`网络状态：${uplink}`}
                            type="bar-graph"
                        />
                        <span className="text">{`${rtt}ms`}</span>
                    </div>
                    :
                    <span className="disconnection">
                        <img src={icon_duanwang} alt="" height="100%" width="100%" />
                    </span>
                }
            </Network>
        </Header>
    );
})
export default ClassHeader;