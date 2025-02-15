import React, { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
import { Row, Col, Card, CardHeader, CardBody, Label } from "reactstrap";
import { Button, Form, FormGroup, Input, FormText } from "reactstrap";
import { getAllSettings, getupdateSettings } from "../../actions/lotteryAction";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormHooks from "../../Hooks/FormHook";
import classNames from "classnames";
import LaddaButton, { ZOOM_OUT } from "react-ladda";
import "ladda/dist/ladda-themeless.min.css";

const Setting = (props) => {
  const [
    valuesObj,
    InputChange,
    OnSubmit,
    setDefaultValue,
    InputError,
    DefaultError,
  ] = FormHooks({
    ios_version: {
      rule: "required",
      field: "IOS Version",
    },
    android_version: {
      rule: "required",
      field: "Android Version",
    },
    release_note: {
      rule: "required",
      field: "Release note",
    },
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [check, setCheck] = useState(false);
  const lottery = useSelector((state) => state.lottery);
  const { getsettingDetails } = lottery;

  useEffect(() => {
    props.getAllSettings().then((res) => {
      setDefaultValue([
        {
          ios_version: res?.ios_version,
          android_version: res?.android_version,
          release_note: res?.release_note,
        },
      ]);
      DefaultError([
        {
          ios_version: "",
          android_version: "",
          release_note: "",
        },
      ]);
      setCheck(res?.ads);
    });
  }, [props]);

  const onSave = async (e) => {
    e.preventDefault();
    const validationFlag = await OnSubmit();

    if (validationFlag) {
      setSubmitLoading(true);
      let newObj = {
        ios_version: valuesObj.ios_version,
        android_version: valuesObj.android_version,
        release_note: valuesObj.release_note,
        ads: check.toString(),
      };
      props.getupdateSettings(newObj).then((res) => {
        toast.success(res.data.message);
        setSubmitLoading(false);
      });
    }
  };

  const handleChange = (e) => {
    setCheck(e.target.checked);
  };
  const containerStyle = {
    zIndex: 1999,
  };
  // console.log("check", check);
  return (
    <div className="animated fadeIn">
      {" "}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        style={containerStyle}
      />
      <Row>
        <Col md="12">
          <Card className="card-style shadow">
            <CardHeader>
              <i className="fa fa-cog"></i>
              <strong>Settings</strong>
            </CardHeader>
            <CardBody>
              <Col md="12">
                <Row>
                  <Form className="w-100">
                    <FormGroup>
                      <Label for="exampleEmail">IOS Version</Label>
                      <span className="required">*</span>
                      <Input
                        placeholder="Enter IOS Version"
                        type="text"
                        name="ios_version"
                        value={
                          valuesObj.ios_version ? valuesObj.ios_version : ""
                        }
                        onChange={InputChange}
                        className={classNames({
                          "form-control input d-line": true,
                          invalid: InputError.ios_version,
                        })}
                      />
                      {InputError.ios_version &&
                      InputError.ios_version.length > 0 ? (
                        <div className="error invalid-feedback">
                          <em>{InputError.ios_version}</em>
                        </div>
                      ) : null}
                    </FormGroup>
                    <FormGroup>
                      <Label for="examplePassword">Android Version </Label>
                      <span className="required">*</span>
                      <Input
                        placeholder="Enter Android Version"
                        type="text"
                        name="android_version"
                        value={
                          valuesObj.android_version
                            ? valuesObj.android_version
                            : ""
                        }
                        onChange={InputChange}
                        className={classNames({
                          "form-control input d-line": true,
                          invalid: InputError.android_version,
                        })}
                      />
                      {InputError.android_version &&
                      InputError.android_version.length > 0 ? (
                        <div className="error invalid-feedback">
                          <em>{InputError.android_version}</em>
                        </div>
                      ) : null}
                    </FormGroup>
                    <FormGroup>
                      <Label for="exampleText">Release note</Label>
                      <span className="required">*</span>
                      <Input
                        type="textarea"
                        name="release_note"
                        value={
                          valuesObj.release_note ? valuesObj.release_note : ""
                        }
                        onChange={InputChange}
                        className={classNames({
                          "form-control input d-line": true,
                          invalid: InputError.release_note,
                        })}
                      />
                      {InputError.release_note &&
                      InputError.release_note.length > 0 ? (
                        <div className="error invalid-feedback">
                          <em>{InputError.release_note}</em>
                        </div>
                      ) : null}
                    </FormGroup>

                    <FormGroup check inline className="mt-2">
                      <Label check>Ads Enable</Label>
                      <Input
                        type="checkbox"
                        name="check"
                        value={check}
                        checked={check}
                        onChange={handleChange}
                        className="ml-2"
                      />
                    </FormGroup>
                    <br></br>
                   
                     <div className="text-left mt-2">
                      <LaddaButton
                        className="btn btnColor px-4 btn-ladda"
                        title="Update Setting"
                        loading={submitLoading}
                        data-color="blue"
                        data-style={ZOOM_OUT}
                        onClick={(e) => onSave(e)}
                       
                      >
                        Update Setting
                      </LaddaButton>
                    </div>
                  </Form>
                </Row>
              </Col>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default connect(null, { getAllSettings, getupdateSettings })(Setting);
