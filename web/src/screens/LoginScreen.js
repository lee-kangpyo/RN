import React, { useEffect, useState } from 'react';
import '../css/login.css';
import { InputBox } from '../components/InputBox';
import styled from "styled-components";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login (){
  const url = process.env.REACT_APP_URL;
  const [id, setId] = useState("");

  const navigate = useNavigate(); 
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('auth');
    console.log(isLoggedIn)
    if (isLoggedIn) {
      navigate('/home', { replace: true });
    }
  }, [navigate]);

  const loginWeb = async () => {
      try {
        if(id.length == 0){
          alert("아이디를 입력해 주세요");
        }else{
          const res = await axios.post(url+'/v1/web/test', {id:id});
          localStorage.setItem('auth', id);
          navigate('/home', { replace: true });
        }
      } catch (error) {
          alert("로그인중 오류가 발생했습니다. 잠시후 다시 시도해주세요.")
      }
    };

  return (
      <div className='container'>
          <div className='title'>ALOHA</div>
          <InputBox placeholder={"아이디를 입력해 주세요"} onChange={(e)=>setId(e.target.value)}/>
          <StyledBtn>
              <button className='button' onClick={()=>loginWeb()}>
                  <span className='btnText'>로그인</span>
              </button>
          </StyledBtn>
      </div>
  )
}


const StyledBtn = styled.div`
  margin-top:20px;
  & .button {
    background-color: #3479ef;
    border-radius: 10px;
    border:none;
    width: 100%;
    height: 52px;
    & .btnText{
        color: #ffffff;
        font-family: "SUIT-Bold", Helvetica;
        font-size: 15px;
        font-weight: 700;
        letter-spacing: -0.15px;
        line-height: normal;
        text-align: center;
    }
  }
`;

export default Login;