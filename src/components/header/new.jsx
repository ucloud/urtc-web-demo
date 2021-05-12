import React, { useState, useEffect } from "react";
import { Icon } from "@ucloud-fe/react-components";
import { observer, useLocalStore } from "mobx-react";
import { settings } from "../../store/index"
import { Network, Header, statusMap } from './new.styles.jsx' //样式组件以及配置字典
import icon_duanwang from '../../common/image/duanwang.png'
import { throwError } from "../../../node_modules/rxjs/index";
/**
 * @param client sdk实例
 */

const ClassHeader = observer((props) => {
    const localStore = useLocalStore(() => settings)
    const [uplink, setUplink] = useState("");
    const [upNum, setNum] = useState(0);
    const [linkColor, setLinkColor] = useState("#fff");
    const [rtt, setRtt] = useState(-1);
    useEffect(() => {
        if (props.client == null) return
        function getNetwork() {
            let localStream = props.client.getLocalStreams()
            let remoteStream = props.client.getRemoteStreams()
            let type = "local"
            let sid = null
            if(localStream.length !== 0){
                sid = localStream[0].sid
            }else if(localStream.length === 0 && remoteStream.length !== 0){
                type = "remote"
                sid = remoteStream[0].sid
            }
            props.client.on("network-quality", (Stats) => {
                if (type === "local") {
                    setNum(Stats.uplink)
                    setUplink(statusMap[Stats.uplink].status)
                    setLinkColor(statusMap[Stats.uplink].color)
                } else {
                    setNum(Stats.downlink)
                    setUplink(statusMap[Stats.downlink].status)
                    setLinkColor(statusMap[Stats.downlink].color)
                }
            });
            let timer = setInterval(() => {
                props.client.getNetworkStats(
                    sid,
                    (stats) => {
                        setRtt(stats.rtt)
                    },
                    (error) => {
                        clearInterval(timer);
                        throwError(error)
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
                {upNum !== "6" && rtt !== -1 ?
                    <div>
                        <Icon
                            style={{ color: linkColor }}
                            title={`网络状态：${uplink}`}
                            type="bar-graph"
                        />
                        {rtt >= 0?(<span className="text">{`${rtt}ms`}</span>):null}
                        {/* <span className="text">{`${rtt}ms`}</span> */}
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