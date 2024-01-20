import React, { useEffect, useState } from "react";
import ReportTemplate from "./ReportTemplate";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { redirect } from "react-router-dom";

function ReportList() {
  const [reports, setReports] = useState([]);
  const [status, setStatus] = useState('pending');
  const [search, setSearch] = useState('');

  const handleReports = async () => {
    try {
      const response = await fetch('/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: status, search: search }),
      });

      if (!response.ok) {
        console.log("Reports couldn't be retrieved");
        // Handle non-successful response (e.g., server error)
      }

      const data = await response.json();
      console.log(data);
      setReports(data.filteredArray);
    } catch (error) {
      // Handle error
      console.error(error);
      return redirect("/home");
    }
  };

  useEffect(() => {
    handleReports();
  }, [status]);

  return (
    <Container>
      <Form>
        <Row>
          <Col>
            <Form.Group controlId="formSearch">
              <Form.Control
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="formStatus">
              <Form.Control
                as="select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="pending">Pending Reports</option>
                <option value="checked">Checked Reports</option>
                <option value="removed">Removed Reports</option>
              </Form.Control>
            </Form.Group>
          </Col>
          <Col>
            <Button variant="primary" type="button" onClick={handleReports}>
              Refresh
            </Button>
          </Col>
        </Row>
      </Form>
      <br />

      <Row>
        {Array.isArray(reports) && reports.length > 0 ? (
          reports.map((report) => (
            <Col key={report._id}>
              <ReportTemplate id={report._id} date={report.date} reason={report.reason} />
            </Col>
          ))
        ) : (
          <p>No reports available</p>
        )}
      </Row>
    </Container>
  );
}

export default ReportList;