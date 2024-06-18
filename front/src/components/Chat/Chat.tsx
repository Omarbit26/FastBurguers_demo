import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const socket: Socket = io("http://localhost:3002");

interface ChatProps {
  room: string;
}

const Chat: React.FC<ChatProps> = ({ room }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>(
    []
  );

  useEffect(() => {
    socket.emit("join", room);

    socket.on("message", (message: string) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: message, isUser: false },
      ]);
    });

    return () => {
      socket.off("message");
    };
  }, [room]);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("message", { room, message });
      // setMessages([...messages, { text: message, isUser: true }]);
      setMessage("");
    }
  };

  return (
    <div className="p-4 my-20">
      <div className="border rounded p-4 mb-4 h-64 overflow-y-auto flex flex-col space-y-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 rounded max-w-xs text-white ${
              msg.isUser ? "bg-orange-500 self-end" : "bg-gray-500 self-start"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border rounded p-2 flex-grow"
        />
        <button
          onClick={sendMessage}
          className="ml-2 bg-blue-500 text-white rounded p-2"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;