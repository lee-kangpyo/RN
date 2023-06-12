import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  url:"http://192.168.1.122:8080",
};

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {  },
});

export default configSlice;