import axios from "axios";
import { toast } from "react-toastify";

import { GET_ALL_LOTTERY, GET_ALL_SETTINGS } from "./types";
import "react-toastify/dist/ReactToastify.css";

const config = {
  headers: {
    "Content-Type": "application/json",
  },
};
const PROXY = process.env.REACT_APP_URL;

export const getAllLottery = (page, limit, search) => async (dispatch) => {
  const res = await axios.get(
    `${PROXY}lottery/admin?page=${page}&limit=${limit}&search=${search}`
  );
  dispatch({
    type: GET_ALL_LOTTERY,
    payload: res.data.result,
  });
};

export const lotteryStatus = (id, data) => async (dispatch) => {
  const body = JSON.stringify(data);
  try {
    const res = await axios.put(
      `${PROXY}lottery/admin/change-status/${id}`,
      body,
      config
    );
    toast.success(res.data.message);
    return res;
  } catch (err) {
    toast.error(err.response.data.message);
  }
};

export const getAllSettings = () => async (dispatch) => {
  const res = await axios.get(`${PROXY}admin/setting`);
  dispatch({
    type: GET_ALL_SETTINGS,
    payload: res.data.result,
  });
  return res.data.result;
};

export const getupdateSettings = (formData) => async (dispatch) => {
  const res = await axios.post(`${PROXY}admin/setting`, formData);
  return res;
};
