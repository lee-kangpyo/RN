import {configureStore} from '@reduxjs/toolkit';
import {useDispatch} from 'react-redux';
import rootReducer from './reducers';

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => {
    //if (__DEV__) {
    //  const createDebugger = require('redux-flipper').default;
    //  return getDefaultMiddleware().concat(createDebugger());
    //}
    return getDefaultMiddleware();
  },
});

export default store;