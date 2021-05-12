import styled from "styled-components";

const LoginWrapper = styled.div`
  height: 100vh;
  width: 100vw;
  /* min-width: 1440px; */
  min-height: 375x;
  background: #121f37;
  border-radius: 4px;
  position: relative;
  text-align: center;
  display: flex;
  display: -webkit-flex; /* Safari */
  .version-wrapper {
    width: 100%;
    height: 20px;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    color: #7a8baa;
    line-height: 20px;
    text-align: center;
    padding-top: 60px;
  }
  .setting-content {
    display: inline-block;
    margin: 0 auto;
    width: ${(props) => (props.width ? props.width + "px" : "512px")};
    height: 360px;
    background: #eff2f5;
    border-radius: 4px;
    box-sizing: border-box;
    align-self: center;

    .header {
      margin: 28px 0 0 0;
      position: relative;
      text-align: left;
      padding: 0 20px;
      .header_left,
      .header_right {
        display: inline-block;
        .header_Icon {
          cursor: pointer;
          img {
            height: 14px;
          }
        }
      }

      .header_right {
        position: absolute;
        font-size: 16px;
        top: 0;
        right: 20px;
        color: #526075;
        cursor: pointer;
      }
    }

    .main {
      padding: 44px 0 0 0;
      width: 224px;
      display: inline-block;
      .checkbox-content{
        padding: 5px 0 10px 0;
        text-align:left;
      }
      .btn-content {
        width: 100%;
        padding: 4px 0 0 0;
        .btn {
          width: 100%;
          height: 40px;
        }
      }
      .title-left {
        height: 22px;
        font-size: ${(props) => (props.isPhone ? "14px" : " 16px")};
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 600;
        color: #0a1633;
        text-align: left;
        line-height: 22px;
      }
      .title-right {
        height: 20px;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #526075;
        line-height: 26px;
        text-align: right;
        cursor: pointer;
        .title_icon {
          color: #3860f4;
        }
      }
      .room-id {
        width: 100%;
        height: 40px;
        line-height: 40px;
        box-sizing: border-box;
        padding-left: 8px;
        background: #fff;
        color: #445073;
        /* font-weight: bold; */
      }
    }
  }
`;

export { LoginWrapper }