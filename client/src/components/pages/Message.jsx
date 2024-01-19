import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import './Message.css';

function Message(auth)
{
  const { receiver } = useParams();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [receiverAcc, setReceiverAcc] = useState({});
  const navigate = useNavigate();
  const [err, setErr] = useState("");

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



  const handleMessage = async () =>
  {
    try {
      setLoading(true);

      const response = await fetch('/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: message, receiver: receiver }),
      });

      if (!response.ok) {
        console.log("Message failed to send");
        setLoading(false);
        throw new Error('Failed to send message\n(tip: message should be between 1-300 characters and make sure to login)');
      }

      const data = await response.json();
      setLoading(false);
      console.log(data);
      viewMessages();// Refresh messages after sending
    } catch (error) {
      console.error(error);
      setErr(error.message);
      setLoading(false);
    }
  };

  const viewMessages = async () =>
  {
    try {
      const response = await fetch('/viewmessages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ receiver }),
      });

      if (!response.ok) {
        console.log("Messages failed to load");
        setLoading(false);
      }

      const data = await response.json();
      console.log(data.messages);
      setMessages(data.messages);
      setReceiverAcc(data.receiver);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() =>
  {
    viewMessages();
  }, [loading]);

  return (
    <div className="messaging-page-container card-body">
      <div className="messaging-header"> <h2>Chat with {receiverAcc.name}</h2>
        <button className="btn btn-primary" onClick={() => navigate("/messagehistory")}>Back</button>&nbsp;

      </div>
      {/* Messages */}
      <div className="message-list">
        {messages.map((msg, index) => (
          <span><br />
          
            <div key={index} className={`message-container2 ${msg.senderName === receiverAcc.name ? 'received' : 'sent'}`}><sup className="text-muted">&nbsp;&nbsp;{formatDate(msg.date)}</sup>
              <span className="sender text-left">&nbsp;&nbsp;<b>{msg.senderName}</b>:&nbsp;{msg.message}</span>
            </div>
            
            </span>
        ))}
      </div>

      <form className="message-input">
        <label>Message:</label>
        <textarea
          rows="4"
          cols="50"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength="60"
          required
        />
        <div className="error">{err}</div>
        <button className="btn btn-primary" disabled={loading} type="button" onClick={handleMessage}>
          Send
        </button>
      </form>
    </div>
  );
}

export default Message;
