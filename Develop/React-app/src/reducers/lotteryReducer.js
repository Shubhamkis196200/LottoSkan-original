import { GET_ALL_LOTTERY, GET_ALL_SETTINGS } from "../actions/types";

const initialState = {
  lotteryList: {
    docs: [],
    totalDocs: 0,
    limit: 10,
    page: 1,
    totalPages: 0,
    pagingCounter: 0,
    hasPrevPage: false,
    hasNextPage: false,
    prevPage: null,
    nextPage: null,
  },
  getsettingDetails: {},
  loading: true,
};

const Lottery = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case GET_ALL_LOTTERY:
      return {
        ...state,
        lotteryList: payload,
        loading: false,
      };
    case GET_ALL_SETTINGS:
      return {
        ...state,
        getsettingDetails: payload,
        loading: false,
      };
    default:
      return state;
  }
};
export default Lottery;
