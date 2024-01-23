import { useDispatch, useSelector } from 'react-redux';
import { setReqAlbaChange } from '../../redux/slices/owner';
import { HTTP } from '../util/http';

// 알바가 점주에게 근무 결과 변경 요청한 내역을 점주가 푸시 알림 또는 메인 처음 열었을때 호출 하는 함수.
// userId를 전달해서 알바 근무 결과 수정 요청 데이터 셋팅(뷰에 뱃지)
export const useCommuteChangeList = (userId) => {
    const dispatch = useDispatch();
    const fetchCommuteList = async (callBack) => {
        await HTTP("GET", "/api/v1/commute/getReqCommuteList", {userId:userId})
        .then((res)=>{
            const reqList = res.data.reqList;
            const statR = reqList.filter(el => el.REQSTAT == 'R');
            dispatch(setReqAlbaChange({cnt:statR.length, reqList:reqList}))
            if(callBack) callBack();
        }).catch(function (error) {
            console.log(error);
            //alert("서버 통신 중 오류가 발생했습니다. 잠시후 다시 시도해주세요.");
        })
    };
    return fetchCommuteList;
};
