import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    sCstCo:-1,
    selectedStore:{},
    myStores:[]
};

const albaSlice = createSlice({
  name: 'alba',
  initialState,
  reducers: {
    setMyStores(state, action){
        state.myStores = action.payload.data;
    },
    setSelectedStore(state, action){
        const selectedStore = action.payload.data;
        state.selectedStore = selectedStore;
        state.sCstCo = selectedStore.CSTCO;
    },
  },
});

//외부에서 reducer를 사용하기위해 export
export let { setMyStores, setSelectedStore } = albaSlice.actions

export default albaSlice;