import React from "react";
import styled from "styled-components";
import user from '../assets/icons/user.png'
export const InputBox = ({placeholder, onChange}) => {
    return (
      <StyledBox>
        <input className="input" placeholder={placeholder} onChange={onChange}/>
        <img className="user" alt="user-icon" src={user} />
      </StyledBox>
    );
  };

const StyledBox = styled.div`
    border: 1px solid #dddddd;
    border-radius: 10px;
    display: flex;
    padding: 0px 12px;
    margin-bottom: 10px;
    height: 52px;
    align-items: center;
    & .input{
        border:none;
        flex: 1;
    }
    & .input:focus{
        outline:none;
    }
    & .user {
        height: 25px;
        width: 25px;
        margin: 0px 0px 0px 10px;
    }
`;