// @ts-nocheck
/* eslint-disable */
import React from "react";
import { observer, inject } from "mobx-react";
import sdk, { Client } from "urtc-sdk";
import "./settings.css";
import { isPC } from "../util/index";
import { recordConfig } from "../config/record";

import {
  Modal,
  Input,
  Form,
  Select,
  Radio,
  Message,
} from "@ucloud-fe/react-components";
import config from "../config";
const { Item } = Form;
const { Option } = Select;
const itemLayout = {
  labelCol: {
    span: 2,
  },
  controllerCol: {
    span: 10,
  },
};

@inject("store")
@observer
class Record extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recordVisible: false,
      checkLayout: "flow",
      checkWatermark: "time",
      checkWatermarkPos: "left-top",
      watermarkMsg: "",
      isPhone: !isPC(),
    };
    this.recordClose = this.recordClose.bind(this);
    this.recordOk = this.recordOk.bind(this);
    this.alllayoutChange = this.alllayoutChange.bind(this);
    this.watermarkTypeChange = this.watermarkTypeChange.bind(this);
    this.watermarkPosChange = this.watermarkPosChange.bind(this);
    this.watermarkMsgChange = this.watermarkMsgChange.bind(this);
  }
  componentDidMount() {

    // let storeSettings = this.props.store.settings;
    // storeSettings.startRecord(true);
  }
  componentWillReceiveProps(nextProps) {
    console.log(nextProps)
    console.log(this.props)
    // if (this.props.visible !== nextProps.visible) {
    //   let storeRecord = this.props.store.record;
    //   this.setState({
    //     recordVisible: true,
    //   });
    // }
    // this.setState({
    //   recordVisible: true,
    // });
    // this.setState({
    //       recordVisible: true,
    //     });
  }

  recordClose = () => {
    this.props.close && this.props.close(false);
  };
  recordOk() {
    console.log(this.state)
    const clientData = this.props.store.client;
    const client = clientData.clientData;
    const recordStore = this.props.store.record;
    //this.bucket = "urtc-test";
    //this.region = "cn-bj";
    client.startRecord(
      {
        bucket: recordConfig.bucket,
        region: recordConfig.region,
        layout: {
          type: this.state.checkLayout
        },
        waterMark: {
          position: this.state.checkWatermarkPos,
          type: this.state.checkWatermark,
          remarks: this.state.watermarkMsg,
        }
      },
      function (e, d) {
        console.log(e, d);
        if (!e) {

          recordStore.setUrl(
            `http://urtc-test.cn-bj.ufileos.com/${d.FileName}.mp4`
          );
        }
        console.log(d);
      }
    );
    this.props.close(false);
    // this.setState({
    //   recordVisible: false,
    // });
    // recordStore.recordStart(false);
  }
  alllayoutChange(e) {
    this.setState({
      checkLayout: e,
    });
  }
  watermarkTypeChange(e) {
    this.setState({
      checkWatermark: e,
    });
  }
  watermarkPosChange(e) {
    this.setState({
      checkWatermarkPos: e,
    });
  }
  watermarkMsgChange(e) {
    this.setState({
      watermarkMsg: e.target.value,
    });
  }
  render() {
    const { show } = this.props;
    const {
      checkLayout,
      checkWatermark,
      checkWatermarkPos,
      watermarkMsg,
      isPhone,
    } = this.state;
    const itemLayout = {
      labelCol: {
        span: isPhone ? 4 : 2,
      },
      controllerCol: {
        span: isPhone ? 8 : 10,
      },
    };
    const allLayouts = [
      {
        label: "平铺",
        value: "flow",
      },
      {
        label: "垂直",
        value: "main",
      },
      {
        label: "平铺2",
        value: "customFlow",
      },
      {
        label: "垂直2",
        value: "customMain",
      },
      {
        label: "单画面",
        value: "single",
      },
    ];
    const watermarkType = [
      {
        label: "时间",
        value: "time",
      },
      {
        label: "图片",
        value: "image",
      },
      {
        label: "文本",
        value: "text",
      },
    ];
    const watermarkPos = [
      {
        // 'left-top' | 'left-bottom' | 'right-top' | 'right-bottom'
        label: "左上",
        value: "left-top",
      },
      // {
      //   label: "左下",
      //   value: "left-bottom",
      // },
      // {
      //   label: "右上",
      //   value: "right-top",
      // },
      // {
      //   label: "右下",
      //   value: "right-bottom",
      // },
    ];
    return (
      <Modal
        visible={show}
        size={isPhone ? "sm" : "md"}
        onClose={this.recordClose}
        onOk={this.recordOk}
        title="设置录制参数"
      >
        <Form className="settings">
          <Item label="混流布局：" {...itemLayout}>
            <Radio.Group value={checkLayout} onChange={this.alllayoutChange}>
              {allLayouts.map((e, v) => (
                <Radio key={v} value={e.value}>
                  {e.label}
                </Radio>
              ))}
            </Radio.Group>
          </Item>
          <Item label="水印类型：" {...itemLayout}>
            <Radio.Group
              value={checkWatermark}
              onChange={this.watermarkTypeChange}
            >
              {watermarkType.map((e, v) => (
                <Radio key={v} value={e.value}>
                  {e.label}
                </Radio>
              ))}
            </Radio.Group>
          </Item>
          {checkWatermark == "image" || checkWatermark == "text" ? (
            <Item label="水印内容：" {...itemLayout}>
              <Input vlaue={watermarkMsg} onChange={this.watermarkMsgChange} />
            </Item>
          ) : null}

          <Item label="水印位置：" {...itemLayout}>
            <Radio.Group
              value={checkWatermarkPos}
              onChange={this.watermarkPosChange}
            >
              {watermarkPos.map((e, v) => (
                <Radio key={v} value={e.value}>
                  {e.label}
                </Radio>
              ))}
            </Radio.Group>
          </Item>
        </Form>
      </Modal>
    );
  }
}

export default Record;
