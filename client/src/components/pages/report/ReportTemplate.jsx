import React from "react";
import { Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function ReportTemplate({ id, date, reason })
{
    const navigate = useNavigate();
    function formatDate(timestamp)
    {
        try {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };

            const date = typeof timestamp === 'string' ? new Date(parseInt(timestamp, 10)) : new Date(timestamp);

            return new Intl.DateTimeFormat('en-US', options).format(date);
        } catch (error) {
            console.error('Error formatting date:', error.message);
            return 'Invalid Date';
        }
    }
    const handleStatusChange = async (action) =>
    {
        try {
            const response = await fetch('/setreportstatus', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: action, id: id }),
            });

            if (!response.ok) {
                console.error('Server error:', response.status, response.statusText);

                // Check if the response is JSON
                if (response.headers.get('content-type')?.includes('application/json')) {
                    const errorData = await response.json();
                    console.error('Error response:', errorData);
                } else {
                    const errorText = await response.text();
                    console.error('Non-JSON error response:', errorText);
                }

                throw new Error('Registration failed');
            }

            const data = await response.json();
            console.log(data);

            navigate("/home", { replace: true });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Card className="mb-3">
            <Card.Body className="bg-custom6">
                <Card.Text>
                    <b>Reason:</b> {reason}
                </Card.Text>
                <Card.Text>
                    <b>Date:</b> {formatDate(date)}
                </Card.Text>
                <Button variant="primary" onClick={() => handleStatusChange("checked")}>
                    Mark as Checked
                </Button>&nbsp;
                <Button variant="danger" onClick={() => handleStatusChange("removed")}>
                    Remove Report
                </Button>
            </Card.Body>
        </Card>
    );
}

export default ReportTemplate;
