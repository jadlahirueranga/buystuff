import React from "react";
import Users from "./Users";
import ReportList from "./report/ReportList";
import { Container, Row, Col } from "react-bootstrap";

function Dashboard({ auth }) {
  //For viewing reports and users for admins and mods
  return (
    <Container>
      <h2 className="mt-4 mb-4">Dashboard</h2>
      
      {(auth.mod || auth.admin) && (
        <div>
          <h3 className="mt-4 mb-3">Users</h3>
          <Users auth={auth} />
        </div>
      )}

      <Row>
        <Col>
          <h3 className="mt-4 mb-3 topic">Reports</h3><br/><br/>
          <ReportList />
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;
