import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Row, Col, Table, Button, Input, Spinner } from "reactstrap";
import { Tooltip } from "react-tippy";
import "react-tippy/dist/tippy.css";
import LaddaButton, { ZOOM_OUT } from "react-ladda";
import "ladda/dist/ladda-themeless.min.css";
import { Link } from "react-router-dom";
import {
  getAllWinnerNumberList,
  winnerUpdate,
} from "../../actions/superWinnerAction";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const SuperWinnerNumberList = (props) => {
  const { id } = useParams();

  const { getAllWinnerNumberList } = props;
  const [winnerList, setWinnerList] = useState([
    {
      winning_number: "",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  //
  useEffect(() => {
    setLoading(true);
    getAllWinnerNumberList(id, startDate).then((res) => {
      setError([]);
      setWinnerList([
        {
          winning_number: "",
        },
      ]);
      if (res.data.result.length === 0) {
        setLoading(false);
      }
      if (res.data.result.length > 0) {
        setWinnerList(res.data.result);
        setLoading(false);
      }
    });
  }, [startDate, getAllWinnerNumberList, id]);
  const [error, setError] = useState([]);

  const [submitLoading, setSubmitLoading] = useState(false);

  const addWinnerNumber = () => {
    setError([]);
    let list = [...winnerList];
    list.push({
      winning_number: "",
    });
    setWinnerList(list);
  };
  const onDelete = (index) => {
    let list = [...winnerList];
    list.splice(index, 1);
    setWinnerList(list);
  };
  const InputChange = (i, e) => {
    let list = [...winnerList];
    let val = e.target.value;
    if (val >= 0) {
      list[i].winning_number = val;
    }

    setWinnerList(list);
  };
  const onSave = async () => {
    let validationFlag = true;

    let errorMsg = winnerList.map((lottery, key) => {
      let error = {};
      // debugger
      if (!lottery.winning_number) {
        validationFlag = false;
        error.error_number = "Lottery number is required";
      } else if (
        winnerList.filter(
          (value) =>
            parseInt(value.winning_number) === parseInt(lottery.winning_number)
        ).length > 1
      ) {
        validationFlag = false;
        error.error_number = "Lottery number must not be same";
      } else if (lottery.winning_number.length > 4) {
        validationFlag = false;
        error.error_number = "Lottery number must be less than 4 digit";
      } else if (
        lottery.winning_number - Math.floor(lottery.winning_number) !==
        0
      ) {
        error.error_number = "Please enter whole number";
      } else {
        error.error_number = "";
      }

      return error;
    });
    setError(errorMsg);
    if (validationFlag) {
      setSubmitLoading(true);
      let numberList = await winnerList.map((s) => {
        return s.winning_number;
      });
      let newData = {
        numberList,
        date: startDate,
        lottery: id,
        type: 2,
      };
      props
        .winnerUpdate(newData)
        .then((res) => {
          setSubmitLoading(false);
          toast.success(res.data.message);
          setError([]);
        })
        .catch((err) => {
          setSubmitLoading(false);
          toast.error(err.response.data.message);
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
        <Col sm="4" md="4">
          <div className="text-right">
            <Tooltip
              title="Add Winner Number"
              position="bottom"
              arrow={true}
              distance={15}
              trigger="mouseenter"
            >
              <Button
                size="md"
                className="btnColor btn-brand my-4"
                onClick={addWinnerNumber}
              >
                <i className="fa fa-plus"></i>
                <span>Add</span>
              </Button>
            </Tooltip>
          </div>
        </Col>
        <Col sm="12" md="12">
          <Table responsive striped className="mt-2 customDataTable">
            <thead>
              <tr>
                <th>Winning number</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {winnerList.map((s, i) => (
                <tr>
                  <td>
                    <Input
                      type="number"
                      placeholder="Enter Winning number"
                      value={s.winning_number}
                      onChange={(e) => InputChange(i, e)}
                      min={0}
                    />
                    <em>
                      <div className="text-danger">
                        {error.length - 1 >= i && error[i].error_number}
                      </div>
                    </em>
                  </td>
                  <td>
                    <Tooltip
                      title="Delete Winner number"
                      position="bottom"
                      arrow={true}
                      distance={15}
                      trigger="mouseenter"
                    >
                      <Button
                        size="md"
                        disabled={winnerList.length <= 1 ? true : false}
                        className="btn-youtube btn-brand"
                        onClick={() => onDelete(i)}
                        type="button"
                      >
                        <i className="fa fa-trash"></i>
                      </Button>
                    </Tooltip>
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
SuperWinnerNumberList.propTypes = {};
export default connect(null, { getAllWinnerNumberList, winnerUpdate })(
  SuperWinnerNumberList
);
