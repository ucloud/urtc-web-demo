import styled from "styled-components";
const Header = styled.div`
  position: relative;
  height: 36px;
  line-height: 36px;
  text-align: left;
  box-sizing: border-box;
  background-color: #2f3238;
  .disconnection{
    display:inline-block;
    height: 20px;
    width:20px;
    vertical-align:middle;
    font-size:0;
  }
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
export {
  Header, Network, statusMap
}