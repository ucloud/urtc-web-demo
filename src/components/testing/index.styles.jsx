import styled from "styled-components";

const StepWrapper = styled.div`
  padding: 10px 0 0 0;
  text-align: center;
`;
const ErrorWrapper = styled.div`
  position: relative;
  height: 100%;
  padding: 20px;
`;

// const NoSpearList = styled.div`

// `
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
  position: absolute;
  bottom: 0;
`;

const EndWrapper = styled.div`
  position: relative;
  height: 318px;
  width: 100%;
  box-sizing: border-box;
  padding: 10px 0;
  .content {
    > div:nth-child(odd) {
      background: #f7f7fd;
    }
  }

  .error {
    color: #f44336;
  }
  p {
    padding: 0;
    margin: 0;
  }
  .left,
  .right {
    vertical-align: top;
    height: 32px;
    line-height: 32px;
    display: inline-block;
    width: 200px;
  }
  .errorInfo {
    color: #f44336;
    background-color: null;
    position: absolute;
    bottom: 60px;
    left: 35%;
  }
`;

export {
    StepWrapper, ErrorWrapper, BtnWrapper, EndWrapper
}