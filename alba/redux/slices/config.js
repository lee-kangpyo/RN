import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  url:"http://172.30.1.13:8080",
};

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {  },
});

export default configSlice;