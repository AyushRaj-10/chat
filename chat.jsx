import React, { useState, useEffect } from 'react';

function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [recipientID, setRecipientID] = useState(""); // ID of recipient

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:4000');
    setSocket(ws);

    ws.onmessage = (e) => {
      const newMessage = JSON.parse(e.data);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    return () => ws.close();
  }, []);

  const sendMessage = () => {
    if (message.trim() !== '' && recipientID.trim() !== '') {
      socket.send(JSON.stringify({ content: message, sender: 'User1', targetID: recipientID }));
      setMessage('');
    }
  };

  return (
    <div>
      <div style={{ border: '1px solid #ccc', height: '300px', overflowY: 'scroll', padding: '10px' }}>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.sender}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={recipientID}
        onChange={(e) => setRecipientID(e.target.value)}
        placeholder="Enter recipient ID"
        style={{ width: '300px', padding: '10px' }}
      />
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
        style={{ width: '300px', padding: '10px' }}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default ChatBox;
