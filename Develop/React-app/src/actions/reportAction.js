import axios from "axios";

const PROXY = process.env.REACT_APP_URL;
export const getAllReport = (start, end) => async (dispatch) => {
  const res = await axios.get(`${PROXY}report/admin?start=${start}&end=${end}`);
  return res;
};
