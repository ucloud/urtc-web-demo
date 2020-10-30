import React from "react";
import styled from "styled-components";
import { Message } from "@ucloud-fe/react-components";
import { observer, inject } from "mobx-react";
import ReactPlayer from "react-player";

const Wrapper = styled.div`
  position: relative;
  height: 160px;
  padding: 10px 0 0 0;
`;

/**
 * @param index
 * @param id
 */

@inject("store")
@observer
class VideoWrapper extends React.Component {
  static defaultProps = {
    index: 0,
    id: null,
  };

  state = {
    stream: null,
    previewId: null,
  };

  componentDidMount() {
    this.createStream(this.props.id);
  }

  createStream = (id) => {
    this.store = this.props.store.testingStore;
    this.store.sdkClient.createStream(
      {
        previewId: id,
        audio: true,
        video: true,
        cameraId: id,
      },
      (error, stream) => {
        if (!error) {
          this.setState({
            stream,
            previewId: `${id}`,
          });
          console.log("create video stream success:", stream);
        } else {
          Message.error(`create video stream failed:${error}`);
        }
      }
    );
  };

  destroy = (id) => {
    if (id) {
      this.store = this.props.store.testingStore;
      this.store.sdkClient.destroyStream(id, (error) => {
        if (error) {
          console.log(`销毁流失败>>>:`, error);
        } else {
          console.log(`销毁流成功`);
        }
      });
    }
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.id !== nextProps.id) {
      if (this.state.previewId) {
        this.destroy(this.props.id);
      }
      this.createStream(nextProps.id);
    }
  }

  render() {
    let { stream, previewId } = this.state;
    return (
      <Wrapper>
        <ReactPlayer
          key={previewId}
          width="100%"
          height="100%"
          url={stream && stream.mediaStream}
          muted={true}
          playing
          playsinline
        />
      </Wrapper>
    );
  }
}

export default VideoWrapper;
