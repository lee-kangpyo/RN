import React, { useState } from 'react';
import { CommuteBtn } from '../components/CommuteBtn';
import styled from "styled-components";
import { useNavigate } from 'react-router-dom';

function Home (){
    const [btnText, setBtnText] = useState("출근")
    const navigate = useNavigate(); 
    const logOut = () => {
        localStorage.removeItem('auth')
        navigate('/', { replace: true });
    }
    return (
        <>
            <StyledTitle>알바 출퇴근</StyledTitle>
            <TextButton onClick={() => logOut()}>로그아웃</TextButton>
            <CommuteBtn btnText={btnText} setBtnText={setBtnText}/>
        </>
    )
}


const StyledTitle = styled.div`
    font-family: 'SUIT-Bold';
    font-size: 24px;
    margin: 30px;
`;

// 텍스트 버튼 스타일
const TextButton = styled.button`
  background: none;
  color: #007bff; /* 기본 텍스트 색상 */
  border: none;
  padding: 0;
  cursor: pointer;
  font-size: 16px;
  text-decoration: underline; /* 텍스트에 밑줄을 추가하여 링크처럼 보이게 함 */

  &:hover {
    color: #0056b3; /* 호버 상태일 때 텍스트 색상 */
    text-decoration: none; /* 호버 상태일 때 밑줄 제거 */
  }

  &:focus {
    outline: none; /* 버튼 클릭 시 발생하는 아웃라인 제거 */
  }
`;


export default Home;