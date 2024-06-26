import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
const apiURL = process.env.NEXT_PUBLIC_API_URL;

const socket: Socket = io(`${apiURL}`);

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
      setMessages([...messages, { text: message, isUser: true }]);
      setMessage("");
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <section className="text-gray-600 body-font relative">
      <div className="container px-5 py-24 mx-auto ">
        <div className="flex flex-col text-center w-full mb-12">
          <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
            Comunícate con el Administrador
          </h1>
          <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
            Tus problemas, nos importan.
          </p>
          <p className="lg:w-2/3 mx-auto leading-relaxed text-sm text-gray-600">
            La respuesta del administrador suele tomar de 2 a 5 minutos.
            Agradecemos tu paciencia.
          </p>
        </div>
        <div className="lg:w-1/2 md:w-2/3 mx-auto">
          <div className="flex flex-wrap -m-2">
            <div className="p-2 w-full">
              <div className="relative">
                <label
                  htmlFor="chat"
                  className="leading-7 text-sm text-gray-600"
                >
                  Chat
                </label>
                <div className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 h-64 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out overflow-y-auto flex flex-col space-y-2">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded max-w-xs text-white ${
                        msg.isUser
                          ? "bg-orange-500 self-end"
                          : "bg-gray-500 self-start"
                      }`}
                    >
                      {msg.text}
                    </div>
                  ))}
                </div>
                <div className="flex mt-4">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown} // Añadir el evento onKeyDown aquí
                    className="rounded p-2 flex-grow"
                  />
                </div>
              </div>
            </div>
            <div className="p-2 w-full">
              <button
                onClick={sendMessage}
                className="flex mx-auto text-white bg-orange-500 border-0 py-2 px-8 focus:outline-none hover:bg-orange-600 rounded text-lg"
              >
                Enviar
              </button>
            </div>
            <div className="p-2 w-full pt-8 mt-8 border-t border-gray-200 text-center">
              <a className="text-orange-500">fastburguer@gmail.com</a>
              <p className="leading-normal my-5">
    Av. Santa Fe 1249
    <br />
    Buenos Aires, CABA 1425
</p>
              <span className="inline-flex">
                <a className="text-gray-500">
                  <svg
                    fill="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                  </svg>
                </a>
                <a className="ml-4 text-gray-500">
                  <svg
                    fill="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                  </svg>
                </a>
                <a className="ml-4 text-gray-500">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                  >
                    <rect
                      width="20"
                      height="20"
                      x="2"
                      y="2"
                      rx="5"
                      ry="5"
                    ></rect>
                    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
                  </svg>
                </a>
                <a className="ml-4 text-gray-500">
                  <svg
                    fill="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                  >
                    <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
                  </svg>
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Chat;
