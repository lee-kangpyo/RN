import './App.css';
import { BrowserRouter, Route, Routes, Switch, Link, Navigate } from "react-router-dom";
import { useEffect } from 'react';
import { BrowserView, MobileView } from 'react-device-detect'

import Home from './screens/HomeScreen';
import Login from './screens/LoginScreen';

import PrivateRoute from './components/PrivateRoute';
import NotFoundScreen from './screens/NotFoundScreen';

function App() {
  function setScreenSize() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }
  useEffect(() => {
    setScreenSize();
  });
  return (
    <>
    <div className="App">
      <BrowserView>
        <div className='center'>
          모바일로 접속해주세요
        </div>
      </BrowserView>
      <MobileView>
        <Routes>
          <Route path='/' element={<Navigate replace to="/login" />} />
          <Route path='/login' element={<Login />} />
          <Route element={<PrivateRoute />}>
            <Route path="/home" element={<Home />} />
          </Route>
          {/* 빈 페이지 */}
          <Route path="*" element={<NotFoundScreen />} />
        </Routes>
      </MobileView>
    </div>
    </>
  );
}

export default App;
