import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  url:"http://:8546",
};

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {  },
});



export default configSlice;