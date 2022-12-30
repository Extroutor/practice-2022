import { createStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";

import {
  userInfo,
  balanceInfo,
  receiveData,
  streamData,
  sockectReducer,
  withdrawnReducer,
} from "./reducers/userInfo";

import { modalReducer } from "./reducers/currancyModalReducer";

const reducers = combineReducers({
  user: userInfo,
  balance: balanceInfo,
  receive: receiveData,
  stream: streamData,
  socket: sockectReducer,
  withdrawn: withdrawnReducer,
  modal: modalReducer,
});

const store = createStore(reducers, composeWithDevTools(applyMiddleware(thunk)));
// const store = createStore(reducers, applyMiddleware(thunk));

export default store;
