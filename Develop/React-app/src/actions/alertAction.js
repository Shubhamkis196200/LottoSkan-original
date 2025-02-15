import { SET_ALERT, DELETE_ALERT, DELETE_ALL_ALERT } from "./types";
import { v4 as uuid } from "uuid";

export const setAlert = (msg, alertType) => async (dispatch) => {
  const id = uuid();
  dispatch({
    type: SET_ALERT,
    payload: {
      id,
      msg,
      alertType,
    },
  });

  setTimeout(() => dispatch({ type: DELETE_ALERT, payload: id }), 5000);
};

export const deleteAlert = (id) => async (dispatch) => {
  dispatch({
    type: DELETE_ALERT,
    payload: id,
  });
};

export const deleteAllAlert = () => async (dispatch) => {
  dispatch({
    type: DELETE_ALL_ALERT,
  });
};
