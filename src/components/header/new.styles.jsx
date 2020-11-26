import styled from "styled-components";
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


export {
    Header, Network
}