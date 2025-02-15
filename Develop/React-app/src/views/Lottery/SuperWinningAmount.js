import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Row, Col, Table, Button, Input, Spinner } from "reactstrap";

import "react-tippy/dist/tippy.css";
import LaddaButton, { ZOOM_OUT } from "react-ladda";
import "ladda/dist/ladda-themeless.min.css";
import { Link } from "react-router-dom";
import { useLocation, useParams } from "react-router-dom";
import {
  getAllWinnerAmount,
  amountUpdate,
} from "../../actions/superWinnerAmount";
import { connect } from "react-redux";
import { toast } from "react-toastify";

const SuperWinnigAmount = (props) => {
  const { getAllWinnerAmount } = props;
  const { id } = useParams();
  const search = useLocation().search;
  const limit = 7;

  const [winnerList, setWinnerList] = useState([]);
  const [error, setError] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  useEffect(() => {
    setLoading(true);
    let list = [];
    for (let i = 0; i < limit; i++) {
      list.push({
        winning_amount: "",
        winning_number_match: i + 1,
      });
    }
    setWinnerList(list);
    getAllWinnerAmount(id, startDate).then((res) => {
      if (res.data.result.length === 0) {
        setLoading(false);
      }
      if (res.data.result.length > 0) {
        setWinnerList(res.data.result);
        setLoading(false);
      }
    });
  }, [startDate, id, getAllWinnerAmount]);

  const [submitLoading, setSubmitLoading] = useState(false);
  const InputChange = (i, e) => {
    let list = [...winnerList];
    let val = e.target.value;
    if (val >= 0) {
      list[i].winning_amount = val;
    }

    setWinnerList(list);
  };

  const onSave = async () => {
    let validationFlag = true;
    let errorMsg = winnerList.map((lottery, key) => {
      let error = {};
      // debugger
      if (!lottery.winning_amount) {
        validationFlag = false;
        error.error_number = "Amount number is required";
      } else {
        validationFlag = true;
        error.error_number = "";
      }
      return error;
    });
    setError(errorMsg);
    if (validationFlag) {
      const amountList = await winnerList.map((s, i) => {
        return {
          matched: i + 1,
          amount: s.winning_amount,
        };
      });
      let newObj = {
        amountList,
        lottery: id,
        date: startDate,
        type: 2,
      };
      props
        .amountUpdate(newObj)
        .then((res) => {
          toast.success(res.data.message);
          setError([]);
        })
        .catch((err) => {
          toast.success(err.response.data.message);
        });
    }
  };

  return (
    <div className="animated fadeIn">
      <Row>
        <Col sm="6" md="6" className="pr-0">
          <div className="text-left mt-3">
            <label className="">Select Date</label>
            <Input
              type="date"
              defaultValue={startDate}
              onChange={(date) => setStartDate(date.target.value)}
              className="input w-50 mx-2 d-inline"
            />
          </div>
        </Col>
        <Col sm="2" md="2" className="mt-3">
          {loading ? <Spinner /> : ""}
        </Col>
        <Col sm="12" md="12">
          <Table responsive striped className="mt-2 customDataTable">
            <thead>
              <tr>
                <th>Matched number</th>
                <th>Super Winning Amount</th>
              </tr>
            </thead>
            <tbody>
              {winnerList.map((s, i) => (
                <tr key={i}>
                  <td>{s.winning_number_match}</td>
                  <td>
                    <Input
                      type="number"
                      placeholder="Enter Amount"
                      value={s.winning_amount}
                      onChange={(e) => InputChange(i, e)}
                      min={0}
                    />
                    <em>
                      <div className="text-danger">
                        {error.length - 1 >= i && error[i].error_number}
                      </div>
                    </em>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Link to="/lottery">
            <Button size="md" color="secondary" className="mr-1">
              <i className="fas fa-arrow-left mr-1"></i>
              Back
            </Button>
          </Link>
          <LaddaButton
            className="btn btnColor px-4 btn-ladda"
            loading={submitLoading}
            data-color="blue"
            data-style={ZOOM_OUT}
            onClick={onSave}
          >
            Submit
          </LaddaButton>
        </Col>
      </Row>
    </div>
  );
};
SuperWinnigAmount.propTypes = {};
export default connect(null, { getAllWinnerAmount, amountUpdate })(
  SuperWinnigAmount
);
