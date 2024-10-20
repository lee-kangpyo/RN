import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    cstCo:"",
    storeList:[],
    // 점주 매출 현황 - 파란색 항목은 터치해서 입력가능합니다. 보여주는지 여부.
    profitScreenHint:true,
};

const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setOwnerCstco(state, action){
        state.cstCo = action.payload.cstCo;
    },
    setOwnerStoreList(state, action){
        state.storeList = action.payload.storeList;
        if(state.cstCo == ""){
          if(state.storeList.length > 0){
            state.cstCo = action.payload.storeList[0].CSTCO;
          }
        }
    },
    setProfitHint(state, action){
      state.profitScreenHint = action.payload.isShow;
    }
  },
});

//외부에서 reducer를 사용하기위해 export
export let { setOwnerCstco, setOwnerStoreList, setProfitHint } = commonSlice.actions

export default commonSlice;