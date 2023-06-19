import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  url:"http://192.168.0.104:8080",
};

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {  },
});

export default configSlice;