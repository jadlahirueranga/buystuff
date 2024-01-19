import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function Report() {
  //report a post
  const { postId } = useParams();
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleReport = async () => {
    try {
      const response = await fetch('/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason: reason, postId: postId }),
      });

      if (!response.ok) {
        throw new Error('Reporting failed\n(tip: report should be between 1-300 characters and make sure to login)');
      } else {
        setError('Successfully Reported!');
      }

    } catch (error) {
      setError(error.message);
      console.error(error);
    }
  };

  return (
    <div className="container mt-5 ">
      <div className="col-md-6 offset-md-3 offset">
        <div className="card ">
          <div className="card-body bg-custom6">
            <h2 className="card-title">Report</h2>
            <form>
              <div className="form-group">
                <textarea
                  rows="4"
                  cols="50"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  maxLength="300"
                  placeholder="Reason"
                  required
                  className="form-control"
                />
              </div>
              <div className="text-danger">{error}</div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleReport}
              >
                Report
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Report;
