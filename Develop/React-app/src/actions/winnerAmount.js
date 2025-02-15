import axios from "axios";
import { toast } from "react-toastify";
const config = {
  headers: {
    "Content-Type": "application/json",
  },
};
const PROXY = process.env.REACT_APP_URL;

export const getAllWinnerAmount = (id, date) => async (dispatch) => {
  const res = await axios.get(`${PROXY}amount/admin/${id}/1?date=${date}`);
  return res;
};

export const amountUpdate = (data) => async (dispatch) => {
  const body = JSON.stringify(data);
  const res = await axios.post(`${PROXY}amount/admin`, body, config);
  return res;
};
