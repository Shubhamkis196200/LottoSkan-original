import React, { useEffect, useState } from "react";
import { Row, Col, Card, CardHeader, CardBody, Label } from "reactstrap";
import { DateRangePicker } from "rsuite";
import { startOfDay, endOfDay, addDays, subDays, format } from "date-fns";
import { Bar } from "react-chartjs-2";
import { getAllReport } from "../../actions/reportAction";
import { connect } from "react-redux";

const Index = (props) => {
  const { getAllReport } = props;
  const [date, setDate] = useState([
    startOfDay(subDays(new Date(), 30)),
    endOfDay(new Date()),
  ]);

  const [chartData, setChartData] = useState({});
  useEffect(() => {
    getAllReport(
      format(new Date(date[0]), "yyyy-MM-dd"),
      format(new Date(date[1]), "yyyy-MM-dd")
    )
      .then((res) => {
        let data = {
          labels: [],
          datasets: [
            {
              label: "Coupon scratch",
              backgroundColor: "rgba(75,192,192,1)",
              borderColor: "rgba(0,0,0,1)",
              borderWidth: 1,
              data: [],
            },
          ],
        };
        res.data.result.forEach((s) => {
          data.labels.push(s._id);
          data.datasets[0].data.push(s.count);
        });
        setChartData(data);
      })
      .catch((err) => {
        console.error(err.message);
      });
  }, [date]);
  const CalendarDate = (data) => {
    console.log(data);
    setDate(data);
  };
  return (
    <div className="animated fadeIn">
      <Row>
        <Col md="12">
          <Card className="card-style shadow">
            <CardHeader>
              <i className="fas fa-server"></i>
              <strong>Report</strong>
            </CardHeader>
            <CardBody>
              <Col md="12">
                <Row>
                  <Col md="2" className="mt-2">
                    <Label className="mr-2">Select Date Range</Label>
                  </Col>
                  <Col md="4">
                    <DateRangePicker
                      placeholder="Select Date Range"
                      ranges={Ranges}
                      format={"dd-MMM-yyyy"}
                      character={"-to-"}
                      block
                      cleanable={false}
                      onChange={CalendarDate}
                      defaultValue={date}
                    />
                  </Col>
                </Row>
              </Col>
              <hr />
              <Col md="12">
                <Bar
                  data={chartData}
                  options={{
                    title: {
                      display: true,
                      text: "Report",
                      fontSize: 20,
                    },
                    legend: {
                      display: true,
                      position: "right",
                    },
                  }}
                />
              </Col>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default connect(null, { getAllReport })(Index);

const Ranges = [
  {
    label: "yesterday",
    value: [
      startOfDay(addDays(new Date(), -1)),
      endOfDay(addDays(new Date(), -1)),
    ],
  },
  {
    label: "1 week",
    value: [startOfDay(subDays(new Date(), 6)), endOfDay(new Date())],
  },
  {
    label: "1 month",
    value: [startOfDay(subDays(new Date(), 30)), endOfDay(new Date())],
  },
  {
    label: "3 months",
    value: [startOfDay(subDays(new Date(), 90)), endOfDay(new Date())],
  },
  {
    label: "6 months",
    value: [startOfDay(subDays(new Date(), 180)), endOfDay(new Date())],
  },
  {
    label: "1 year",
    value: [startOfDay(subDays(new Date(), 365)), endOfDay(new Date())],
  },
];
