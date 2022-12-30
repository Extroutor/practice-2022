import {
  EXTENSION_UPDATE,
  ADDRESS_UPDATE,
  BALANCE_UPDATE,
  BALANCE_FAIL,
  BALANCE_LOADING,
  RECEIVE_DATA_FAIL,
  RECEIVE_DATA_LOADING,
  RECEIVE_DATA_UPDATE,
  STREAM_DATA_FAIL,
  STREAM_DATA_LOADING,
  STREAM_DATA_UPDATE,
  STREAM_WITHDRAWN_UPDATE,
  NEW_SOCKET_STREAM,
  CANCEL_SOCKET_STREAM,
  WITHDRAW_SOCKET_STREAM,
  SET_SOCKET,
  HISTORY_DETAILS_LOADING,
  HISTORY_DETAILS_SUCCESS,
  HISTORY_DETAILS_FAIL,
  NEW_STREAM_COLOR,
  CANCEL_STREAM_COLOR,
  WITHDRAW_STREAM_COLOR,
  UPDATE_CONTRACT_FEE,
  UPDATE_USER_IDENTIFIER,
  EDIT_SHOW_NICKNAMES,
  UPDATE_USER_IDENTIFIER_ADDRESS,
} from "../constrains/userInfo";

const userInfo = (
  state = {
    address: null,
    //@ts-ignore
    extension: null,
    nickName: null,
    showNicknames: false,
  },
  action: { type: String; payload: any }
) => {
  switch (action.type) {
    case EXTENSION_UPDATE:
      return { ...state, extension: action.payload };
    case ADDRESS_UPDATE:
      return { ...state, address: action.payload };
    case UPDATE_USER_IDENTIFIER:
      return { ...state, nickName: action.payload };
    case UPDATE_USER_IDENTIFIER_ADDRESS:
      return { ...state, ...action.payload };
    case EDIT_SHOW_NICKNAMES:
      return { ...state, showNicknames: !state.showNicknames };
    default:
      return state;
  }
};

const balanceInfo = (
  state = { loading: false, error: false, balance: {}, fee: 0.1 },
  action: { type: String; payload: any }
) => {
  switch (action.type) {
    case BALANCE_LOADING:
      return { loading: true, error: false, balance: state.balance, fee: state.fee };
    case BALANCE_UPDATE:
      return {
        loading: false,
        balance: { ...state.balance, ...action.payload },
        error: false,
        fee: state.fee,
      };
    case BALANCE_FAIL:
      return { loading: false, balance: state.balance, error: true, fee: state.fee };
    case UPDATE_CONTRACT_FEE:
      return { ...state, fee: typeof action.payload !== "undefined" ? action.payload : state.fee };
    default:
      return state;
  }
};

const receiveData = (
  state: { loading: boolean; error: boolean; data: Array<Object> } = {
    loading: false,
    error: false,
    data: [],
  },
  action: { type: String; payload: any }
) => {
  switch (action.type) {
    case RECEIVE_DATA_LOADING:
      return { loading: true, error: false, data: [] };
    case RECEIVE_DATA_UPDATE:
      return { loading: false, data: action.payload, error: false };
    case RECEIVE_DATA_FAIL:
      return { loading: false, data: [], error: true };
    case NEW_SOCKET_STREAM:
      return {
        ...state,
        data: [{ ...action.payload, newStream: true }, ...state.data],
        newStream: action.payload,
      };
    case CANCEL_SOCKET_STREAM:
      //@ts-ignore
      const { data } = state;
      for (const i in data) {
        //@ts-ignore
        if (data[i].id === action.payload.id) {
          //@ts-ignore
          data[i].is_canceled = true;
          //@ts-ignore
          data[i].cacnel_date = action.payload.cancelDate;
          //@ts-ignore
          data[i].new_cancel = true;
          //@ts-ignore
          data[i].withdrawn = action.payload.withdrawn;
        }
      }
      return { ...state, data: data };

    case CANCEL_STREAM_COLOR: {
      const { data } = state;
      const newData = data.map((item: any) => {
        if (item.id === action.payload.id) item.new_cancel = false;
        return item;
      });
      return { ...state, data: newData };
    }

    case STREAM_WITHDRAWN_UPDATE:
      //@ts-ignore
      const { data: withdrawnData } = state;
      for (const i in withdrawnData) {
        //@ts-ignore
        if (withdrawnData[i].id === action.payload.id) {
          //@ts-ignore
          withdrawnData[i].withdrawn += Number(action.payload.withdrawn);
        }
      }
      return { ...state, data: withdrawnData };

    case NEW_STREAM_COLOR: {
      const { data } = state;
      const newData = data.map((item: any) => {
        if (item.id === action.payload.id) item.newStream = false;
        return item;
      });
      return { ...state, data: newData };
    }
    default:
      return state;
  }
};

const streamData = (
  state: { data: Array<any>; loading: boolean; error: boolean } = {
    loading: false,
    error: false,
    data: [],
  },
  action: { type: String; payload: any }
) => {
  switch (action.type) {
    case STREAM_DATA_LOADING:
      return { loading: true, error: false, data: [] };
    case STREAM_DATA_UPDATE:
      return { loading: false, data: action.payload, error: false };
    case STREAM_DATA_FAIL:
      return { loading: false, data: [], error: true };

    case WITHDRAW_SOCKET_STREAM:
      //@ts-ignore
      const { data } = state;
      for (const i in data) {
        if (data[i].id === action.payload.id) {
          data[i].withdrawn = action.payload.withdrawn;
          data[i].newWithdrawn = true;
        }
      }
      return { ...state, data: data };

    case WITHDRAW_STREAM_COLOR: {
      const { data } = state;
      const newData = data.map((item: any) => {
        if (item.id === action.payload.id) item.newWithdrawn = false;
        return item;
      });
      return { ...state, data: newData };
    }

    case CANCEL_SOCKET_STREAM:
      //@ts-ignore
      const { data: streamData } = state;
      for (const i in streamData) {
        //@ts-ignore
        if (streamData[i].id === action.payload.id) {
          //@ts-ignore
          streamData[i].is_canceled = true;
          //@ts-ignore
          streamData[i].cacnel_date = action.payload.cancelDate;
          //@ts-ignore
          streamData[i].new_cancel = true;
          //@ts-ignore
          streamData[i].withdrawn = action.payload.withdrawn;
        }
      }
      return { ...state, data: streamData };

    default:
      return state;
  }
};

const sockectReducer = (state = { socket: null }, action: { type: string; payload: any }) => {
  switch (action.type) {
    case SET_SOCKET:
      return { socket: action.payload };
    default:
      return state;
  }
};

const withdrawnReducer = (state = {}, action: { type: string; payload: any }) => {
  switch (action.type) {
    case HISTORY_DETAILS_LOADING:
      return { ...state, [action.payload.id]: { loading: true } };
    case HISTORY_DETAILS_SUCCESS:
      return { ...state, [action.payload.id]: { loading: false, data: action.payload.data } };
    case HISTORY_DETAILS_FAIL:
      return { ...state, [action.payload.id]: { loading: false, err: true } };
    default:
      return state;
  }
};

export { userInfo, balanceInfo, receiveData, streamData, sockectReducer, withdrawnReducer };
