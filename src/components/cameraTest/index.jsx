import React from "react";
import styled from "styled-components";
import { Row, Col, Select } from "@ucloud-fe/react-components";
import { observer, inject } from "mobx-react";
import VideoWrapper from "../../container/videoWrapper";
const { Option } = Select;

const Wrapper = styled.div`
  position: relative;
  height: 100%;
`;

const LeftContent = styled.div`
  height: 200px;
  margin: 10% 0 10% 0px;
  box-sizing:border-box;
  padding-left:10px;
  width: 100%;
  vertical-align: top;
  border-right: 2px dashed rgba(0, 0, 0, 0.1);
  .title {
    text-align: left;
  }
  .lable {
    line-height: 20xp;
    display: inline-block;
    padding-right: 10px;
  }
`;

const RightContent = styled.div`
  height: 200px;
  margin: 10% 0 10% 10px;
  width: 100%;
  border-right: 1px;
  box-sizing:border-box;
  padding-top:4px;
  .title {
    font-size: 14px;
    color: #366bee;
    padding-bottom: 11px;
  }
  .text {
    color: #333;
    line-height: 20px;
    font-size: 12px;
    margin: 0;
  }
  .ps {
    color: #666;
    font-size: 12px;
    line-height: 17px;
    width: 285px;
    margin: 0;
    box-sizing: border-box;
    padding: 21px 0 0 90px;
    text-align: left;
  }
`;

const BtnWrapper = styled.div`
  :hover {
    opacity: 0.9;
  }
  width: 100%;
  height: 48px;
  line-height: 48px;
  background-color: ${(props) =>
    props.backgoundColor ? props.backgoundColor : "#366bee"};
  color: ${(props) => (props.color ? props.color : "#fff")};
  cursor: pointer;
  font-size: 16px;
`;

/**
 * @param client sdk实例
 * @param list array []  设备数组
 * @param onOk  func 确定方法
 * @param onCancel func fail方法
 */

@inject("store")
@observer
class CameraTest extends React.Component {
  static defaultProps = {
    index: 0,
    list: [],
  };

  state = {
    selectId: this.props.list[0].deviceId,
  };

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    if (nextProps.client && !this.isWatching) {
      this.Client = nextProps.client;
      this.isWatching = true;
    }
  }

  bundleChangeDevice = (e) => {
    this.setState({
      selectId: e,
    });
  };

  render() {
    let { selectId } = this.state;
    let { list } = this.props;
    return (
      <Wrapper>
        <Row gutter={0}>
          <Col span={6}>
            <LeftContent>
              <div className="title">
                <span className="lable"> 摄像头:</span>
                <Select value={selectId} onChange={this.bundleChangeDevice}>
                  {list.map((v, i) => (
                    <Option key={i} value={v.deviceId}>
                      {v.label}
                    </Option>
                  ))}
                </Select>
              </div>
              <VideoWrapper id={selectId} />
            </LeftContent>
            <BtnWrapper
              onClick={() => {
                this.props.onOk && this.props.onOk();
              }}
            >
              可以看到
            </BtnWrapper>
          </Col>
          <Col span={6}>
            <RightContent>
              <p className="title">看不到画面？试试如下方法：</p>
              <p className="text">1.请允许浏览器使用摄像头权限</p>
              <p className="text">2.确认摄像头未被其他程序占用</p>
              <p className="text">3.选择外置摄像头或换一台电脑</p>
              <p className="ps">
                注意：摄像头损坏可正常直播，只是观看页无法看到您的摄像头画面
              </p>
            </RightContent>
            <BtnWrapper
              onClick={() => {
                this.props.onCancel && this.props.onCancel();
              }}
              backgoundColor={"#eee"}
              color={"#666"}
            >
              看不到
            </BtnWrapper>
          </Col>
        </Row>
      </Wrapper>
    );
  }
}

export default CameraTest;
