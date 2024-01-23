import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    cstCo:"",
    storeList:[],
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
          state.cstCo = action.payload.storeList[0].CSTCO;
        }
        
    },
  },
});

//외부에서 reducer를 사용하기위해 export
export let { setOwnerCstco, setOwnerStoreList } = commonSlice.actions

export default commonSlice;