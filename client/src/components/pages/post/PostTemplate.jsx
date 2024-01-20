import React, { useEffect } from "react";


function PostTemplate({ id, name, images, title, description, district, date, city, price, color, type, user, auth, status, dataFromPost })
{
  const apiUrl = window.__API_PROXY__;

  const userUrl = `${apiUrl}/user/${user}`;
  const postUrl = `${apiUrl}/post/${id}`;
  const reportUrl = `${apiUrl}/report/${id}`;
  const messageUrl = `${apiUrl}/message/${user}`;


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
    <div className="card mb-4 posttemplate">
      <div className="card-body bg-custom text-dark">
      
      { auth.auth ?  <h5 className="card-title"><a class="title-link" href={postUrl}>{title}</a></h5>   : <p><h5 className="card-title"><span href={postUrl}>{title}</span></h5></p>}
        <p className="card-text text-muted small">{newDate}</p>
        {Array.isArray(images) && images.length > 0 ? (
          <div className="card-images">
            {/* {images.map((image, index) => (
              <img key={index} className="img-fluid" src={image} alt={`image_${index}`} />
            ))} */}
            <a class="title-link" href={postUrl}> <img key={0} className="advimage" src={images} alt={`images_${0}`} /></a>
          </div>
        ) : (
          <p>No images available</p>
        )}<br />
        <p className="card-text">{truncatedDescription}</p>
    
        <p className="card-text"><b>Color:</b><br />{color}</p>
        <p className="card-text"><b>Type:</b><br />{type}</p>
        
        <p className="card-text text-center">At {district}, {city} for 
        <span className=""><b> Rs.{price}/=</b></span></p>
        

        <div className="card-links">

          <a href={userUrl} className="btn" role="button">posted by <u>{name}</u></a><br/>&nbsp; 
          {auth.auth ? <span>
          <a href={messageUrl} className="btn btn-success" role="button">✉</a>&nbsp; 
          <a href={reportUrl} className="btn btn-danger" role="button">Report</a>&nbsp; </span>
          :<span></span>}
          {(auth.admin || auth.mod) && (
            <button className="btn btn-danger" onClick={() => handlePostStatus(id, status === 'active' ? 'removed' : 'active')}>
              {status === 'active' ? 'Remove' : 'Restore'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default PostTemplate;
