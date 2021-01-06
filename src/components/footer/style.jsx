
import styled from "styled-components";
const Footer = styled.div`
  position: absolute;
  /* height: ${(props) => (props.isPhone ? "139px" : "64px")}; */
  bottom: 0;
  left: 0;
  width: 100%;
  color: #fff;
  background-color: #2f3238;
  text-align: left;
  box-sizing: border-box;
  overflow: hidden;
  .left_wrapper {
    text-align: left;
  }
  .right_wrapper {
    text-align: right;
    box-sizing: border-box;
    padding-right: 14px;
  }
  .btn {
    margin-left: 12px;
    background-color: #494e5c;
    color: #fff;
    min-width: 64px;
  }
  .uc-fe-button {
    height: 32px;
    vertical-align: inherit;
  }
  .control_wrapper {
    position: relative;
    display: inline-block;
    margin-left: 16px;
    font-size: 18px;
    height: 28px;
    width: 34px;
    line-height: 28px;
    text-align: center;
    padding-top: 3px;
    cursor: pointer;
    background-color: #494e5c;
    vertical-align: middle;
    border-radius: 2px;
    color: #fff;
    box-shadow: 0px 1px 3px -1px rgba(0, 0, 0, 0.32),
      0px 1px 1px -1px rgba(0, 0, 0, 0.5), 0px 1px 2px 0px rgba(0, 0, 0, 0.28),
      0px 1px 0px 0px rgba(255, 255, 255, 0.12);
  }
  .btn_wrapper {
    display: inline-block;
    font-size: 12px;
    &.leave_btn_wrapper {
      padding-left: 6px;
      margin-left: 16px;
      border-left: 1px solid #5a5f73;
    }
    .leave_btn {
      background: #eb5252;
      color: #ffffff;
    }
  }
  .disable {
    color: #999;
  }
  .disable:after {
    display: block;
    content: "";
    width: 2px;
    height: 20px;
    background-color: #fff;
    position: absolute;
    border-radius: 2px;
    transform: rotate(-135deg);
    top: 7px;
    left: 16px;
  }
  .operation-item {
    display: inline-block;
    font-size: 34px;
    line-height: 40px;
    padding: 5px 40px 0;
    cursor: pointer;
    position: relative;
    .active-item {
      font-size: 16px;
      display: block;
      line-height: 20px;
      padding-bottom: 15px;
    }
  }

  &.video-footer {
    overflow: initial;
    background-color: #2f3238;
    padding-top: 18px;
    height: 66px;
  }
  @media screen and (max-width: 900px) {
    .video-footer {
      min-height: 40px;
      padding-top: 10px;
    }
  }
  @media screen and (max-width: 720px) {
    .video-footer {
      min-height: 40px;
      padding-top: 10px;
    }
    .video-header .room-info .roomId,
    .video-header .room-info .userName {
      padding: 0 10px;
    }
    .disable:after {
      top: 12px;
      left: 19px;
    }
    .video-header .network {
      top: 0;
      right: auto;
      left: 200px;
      margin-left: 0;
      line-height: 40px;
      font-size: 12px;
    }
    .video-header .uc-fe-icon {
      font-size: 16px;
    }
    .video-wrapper {
      bottom: 140px;
    }
    .video-wrapper .video-current video {
      left: 0;
      width: 100% !important;
      top: 36px;
      max-height: 220px;
    }
    .video-wrapper .video-cur {
      display: none;
    }
    .video-wrapper .video-list {
      position: absolute;
      top: 225px;
      width: 100%;
      bottom: 0;
    }
    .video-wrapper .video-list li {
      width: 46%;
      margin: 0;
      padding-left: 2.6%;
      margin: 0;
      float: left;
    }

    .footer-left {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      background-color: #1e2024;
      height: 60px;
    }
    .footer-left .left_wrapper {
      text-align: center;
    }
    .footer-left .left_wrapper .control_wrapper {
      width: 40px;
      height: 40px;
      border-radius: 20px;
      line-height: 40px;
      margin: 0 10px;
    }
    .footer-left .leave_btn_wrapper {
      display: inline-block;
      background-color: #eb5252;
    }
    .footer-right .btn_wrapper.leave_btn_wrapper {
      display: none;
    }
    .footer-left .left_wrapper .share-screen {
      display: none;
    }
    .footer-right {
      position: absolute;
      left: 0;
      bottom: 60px;
      height: 80px;
      width: 100%;
      background-color: #1e2024;
    }
    .footer-right .right_wrapper {
      text-align: center;
      border-bottom: 1px solid #5a5f73;
      padding: 0 0 20px;
      margin: 0 20px;
    }
    .footer-right .right_wrapper .btn_wrapper {
      width: 33%;
    }
    .footer-right .right_wrapper button {
      width: 80%;
      height: 40px;
      padding: 0;
      margin: 0 !important;
    }
    .footer-right .active-publish {
      text-align: left;
    }
    .footer-right .active-record {
      text-align: center;
    }
    .footer-right .active-relay {
      text-align: right;
    }
    .footer-right .right_wrapper .btn_wrapper.leave_btn_wrapper {
      border-left: none;
    }
    .footer-right .share-link {
      position: fixed;
      top: 4px;
      right: 4px;
      margin: 0;
      background: transparent;
    }
  }
`;

const Status = styled.div`
  position: relative;
  display: inline-block;
  padding: 6px;
  &:after {
    display: block;
    content: "";
    width: 6px;
    left: 0px;
    top: 5px;
    height: 6px;
    background-color: ${(props) => (props.color ? props.color : "#999")};
    /* animation: vc 1s infinite; */
    position: absolute;
    border-radius: 3px;
    z-index: 11;
  }
  /* @keyframes vc {
    from {
      background-color: #42d448;
    }
    to {
      background-color: #31a035;
    }
  } */
`;

export {
    Footer,
    Status,
}