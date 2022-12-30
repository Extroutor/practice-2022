import React from "react";
import { Row, Col } from "react-bootstrap";

type props = { receiving?: boolean };
const StreamingTitle = ({ receiving }: props) => {
  return (
    <Row className="d-none d-md-flex text-white">
      <Col md={1} style={{display: 'flex', justifyContent: 'center', textTransform: 'uppercase'}}>Status</Col>
      <Col md={2} style={{display: 'flex', justifyContent: 'center', textTransform: 'uppercase'}}>{receiving ? "From" : "To"}</Col>
      <Col md={1} style={{display: 'flex', justifyContent: 'center', textTransform: 'uppercase'}}>Value</Col>
      <Col md={3} style={{display: 'flex', justifyContent: 'center', textTransform: 'uppercase'}}>Progress</Col>
      <Col md={2} className="p-0" style={{display: 'flex', justifyContent: 'center', textTransform: 'uppercase'}}>
        Start Date
      </Col>
      <Col md={2} className="p-0" style={{display: 'flex', justifyContent: 'center', textTransform: 'uppercase'}}>
        End Date
      </Col>
      <Col md={1}></Col>
    </Row>
  );
};

export default StreamingTitle;
