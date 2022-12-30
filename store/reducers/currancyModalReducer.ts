import { HIDE_BUY_CURRANCY_MODAL, SHOW_BUY_CURRANCY_MODAL } from "../constrains/currancyModal";

export const modalReducer = (
  state = {
    show: false,
  },
  action: { type: String; payload: any }
) => {
  switch (action.type) {
    case SHOW_BUY_CURRANCY_MODAL:
      return { show: true, currancy: action.payload };
    case HIDE_BUY_CURRANCY_MODAL:
      return { show: false };
    default:
      return state;
  }
};
