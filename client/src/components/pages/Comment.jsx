import React, { useEffect, useState } from "react";

function Comment({ post, refresh, text }) {
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  var action;

  if (text==="Reply"){
    action="replies";
  }else{
    action="comments"
  }


  function formatDate(timestamp) {
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
  
      const date = typeof timestamp === 'string' ? new Date(parseInt(timestamp, 10)) : new Date(timestamp);
  
      return new Intl.DateTimeFormat('en-US', options).format(date);
    } catch (error) {
      console.error('Error formatting date:', error.message);
      return 'Invalid Date';
    }
  }

  const handleComment = async () => {
    try {
      setLoading(true);

      const response = await fetch('/comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comment: comment, type: comment, receiver: post._id }),
      });

      if (!response.ok) {
        console.log("Message failed to send");
        setLoading(false);
        throw new Error('Failed to send message\n(tip: message should be between 1-300 characters)');
      }

      const data = await response.json();
      setLoading(false);
      console.log(data);
    } catch (error) {
      console.error(error);
      setErr(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, [loading]);

  return (
    <div className="comment-section">
   <div className="comments-section">
   {/* comments */}
  {post.comments.length > 0 ? (
    post.comments.map((msg, index) => (
      <div key={index} className="bg-custom6 comment-item">
        <div className="comment-header">
          <span className="comment-sender">{msg.senderName}</span>
          <span className="comment-date">{formatDate(msg.date)}</span>
        </div>
        <div className="comment-message">{msg.message}</div>
      </div>
    ))
  ) : (
    <p className="title-link no-comments">No {action} yet. Be the first!</p>
  )}
</div>

    {/* post comments */}
      <form className="comment-form">
        <textarea
          id="comment"
          rows="4"
          cols="50"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength="300"
          required
        />
        <div className="error-message">{err}</div>
        <button className="btn btn-primary" disabled={loading} type="button" onClick={handleComment}>
          {text}
        </button>
      </form>
    </div>
  );
}

export default Comment;
