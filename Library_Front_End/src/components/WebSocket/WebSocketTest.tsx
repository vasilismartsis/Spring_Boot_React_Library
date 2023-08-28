import React, { useState, useEffect } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

const WebSocketTest = () => {
  const [stompClient, setStompClient] = useState<Stomp.Client | null>(null);
  const [myMessage, setMessage] = useState("");
  const [receivedMessage, setReceivedMessage] = useState("");

  useEffect(() => {
    const currentURL = window.location.href;
    const ip = new URL(currentURL).hostname;
    const socket = new SockJS(`http://${ip}:8080/ws`);
    const client = Stomp.over(socket);

    client.connect({}, () => {
      setStompClient(client);
      client.subscribe("/topic/messages", (response) => {
        const receivedMessage = JSON.parse(response.body);
        setReceivedMessage(receivedMessage);
        // message.info(<span style={{ fontSize: "30px" }}>HEY</span>);
      });
    });
  }, []);

  const sendMessage = () => {
    if (stompClient && myMessage) {
      stompClient.send("/app/chat", {}, myMessage);
    }
  };

  return (
    <div>
      <div>
        <h2>WebSocket Chat Example</h2>
        <div>
          <input
            type="text"
            value={myMessage}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
        <div>Received: {receivedMessage}</div>
      </div>
    </div>
  );
};

export default WebSocketTest;
