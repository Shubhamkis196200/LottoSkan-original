//
import axios from "axios";
import { toast } from "react-toastify";
const config = {
  headers: {
    "Content-Type": "application/json",
  },
};
const PROXY = process.env.REACT_APP_URL;
export const getAllWinnerNumberList = (id, date) => async (dispatch) => {
  const res = await axios.get(`${PROXY}winner/admin/${id}/2?date=${date}`);
  return res;
};

export const winnerUpdate = (data) => async (dispatch) => {
  const body = JSON.stringify(data);
  const res = await axios.post(`${PROXY}winner/admin`, body, config);
  return res;
};
