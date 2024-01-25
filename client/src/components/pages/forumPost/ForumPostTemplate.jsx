import React, { useEffect } from "react";

function ForumPostTemplate({ id, name, images, title, description, district, date, city, price, color, type, user, auth, status, dataFromPost })
{
  const apiUrl = window.__API_PROXY__;

  const userUrl = `${apiUrl}/api/user/${user}`;
  const postUrl = `${apiUrl}/api/viewforumpost/${id}`;
  const reportUrl = `${apiUrl}/api/report/${id}`;
  const messageUrl = `${apiUrl}/api/message/${user}`;

  //shorten the description to display
  const truncatedDescription = description.length > 100 ? `${description.slice(0, 100)}...` : description;

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
  const newDate = formatDate(date);
  const handlePostStatus = async (id, status) =>
  {
    try {
      const response = await fetch('/removepost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, id }),
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

        dataFromPost(Date.now());
        throw new Error('Remove failed');
      }

      const data = await response.json();
      console.log(data);
      dataFromPost(Date.now());
    } catch (error) {
      console.error(error);
      dataFromPost(Date.now());
    }
  };
  useEffect(() =>
  {

  });

  return (
    <div className="col-md-12 mb-4">
      <div className="card mb-4">
        <div className="card-body bg-custom4 text-dark">
          <h5 className="card-title"><a className="title-link" href={postUrl}>{title}</a></h5>
          <p className="card-text text-muted small">{newDate}</p>
          <p className="card-text">{truncatedDescription}</p>

          <div className="card-links">
            <a href={userUrl} className="btn" role="button">posted by <u>{name}</u></a><br />
            <a href={messageUrl} className="btn btn-success" role="button">✉</a>&nbsp; 
            <a href={reportUrl} className="btn btn-danger" role="button">Report</a>&nbsp; 
            {(auth.admin || auth.mod) && (
              <button className="btn btn-danger" onClick={() => handlePostStatus(id, status === 'active' ? 'removed' : 'active')}>
                {status === 'active' ? 'Remove' : 'Restore'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForumPostTemplate;
