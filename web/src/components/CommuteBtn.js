import React from "react";
import styled from "styled-components";

const StyledBox = styled.div`
  height: 180px;
  width: 180px;

  & .btn {
    height: 180px;
    left: 50%;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 184px;
    opacity: 1;
    transition: opacity 0.2s;
  }
  & .btn:active {
    opacity: 0.5;
  }

  & .overlap-group {
    background: linear-gradient(
      180deg,
      rgb(52, 121, 239) 0%,
      rgb(70.41, 135.45, 246.68) 51.62%,
      rgb(87.67, 149, 253.89) 100%
    );
    border: 6px solid;
    border-color: #d8ecff;
    border-radius: 150px;
    box-shadow: 0px 0px 20px #3479ef66;
    height: 192px;
    left: -6px;
    position: relative;
    top: -6px;
    width: 192px;
  }

  & .text-wrapper {
    color: #ffffff;
    font-family: "SUIT-Bold", Helvetica;
    font-size: 20px;
    font-weight: 700;
    left: 73px;
    letter-spacing: -0.2px;
    line-height: normal;
    position: absolute;
    text-align: center;
    top: 78px;
  }

  & .div {
    color: #ffffff;
    font-family: "SUIT-Regular", Helvetica;
    font-size: 13px;
    font-weight: 400;
    left: 71px;
    letter-spacing: -0.13px;
    line-height: normal;
    position: absolute;
    text-align: center;
    top: 113px;
  }
`;

export const CommuteBtn = ({btnText, setBtnText}) => {
    const onPressedBtn = () => {
        if(btnText == "출근"){
            setBtnText("퇴근")
        } else if(btnText == "퇴근"){
            setBtnText("출근")
        }
    }

    
    return (
    <StyledBox>
        <div className="btn" onClick={onPressedBtn}>
        <div className="overlap-group">
            <div className="text-wrapper">{btnText}</div>
            <div className="div">CLICK</div>
        </div>
        </div>
    </StyledBox>
    );
};
