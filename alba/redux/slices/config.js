import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  
  url:"http://192.168.21.100:8080",
};

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {  },
});

export default configSlice;