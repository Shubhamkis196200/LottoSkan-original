import { SET_ALERT, DELETE_ALERT, DELETE_ALL_ALERT } from "../actions/types";

const initialState = [];
export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_ALERT:
      //   return [...state, payload];
      let newArray = [];
      newArray.push(payload);
      return newArray;
    case DELETE_ALERT:
      return state.filter((alert) => alert.id !== payload);
    case DELETE_ALL_ALERT:
      return (state = []);
    default:
      return state;
  }
}
