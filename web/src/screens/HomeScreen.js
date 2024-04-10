import React, { useState } from 'react';
import { CommuteBtn } from '../components/CommuteBtn';
function Home (){
    const [btnText, setBtnText] = useState("출근")
    return (
        <>
            <div>알바 출퇴근</div>
            <CommuteBtn btnText={btnText} setBtnText={setBtnText}/>
        </>
    )
}

export default Home;