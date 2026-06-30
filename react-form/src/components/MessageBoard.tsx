import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { useSocket } from "../context/SocketContext";
import type { Contact } from "./ContactEntry";
import AuthError from "./AuthError";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import MessageBoardHeader from "./MessageBoardHeader";

const API_URL = import.meta.env.VITE_API_URL;

interface MessageSender {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  image?: string;
}

interface Message {
  _id: string;
  sender: MessageSender;
  recipient: MessageSender;
  content: string;
  createdAt?: string;
  timestamp?: string;
}

interface Props {
  selectedContact: Contact | null;
}

export default function MessageBoard({ selectedContact }: Props) {
  const { user } = useUser();
  const socket = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedContact) return;

    fetch(`${API_URL}/api/messages/get-messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: selectedContact._id }),
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setError(null);
        setMessages(data.messages ?? []);
      })
      .catch((e) =>
        setError(e instanceof Error ? e.message : "Failed to load messages")
      );
  }, [selectedContact]);

  useEffect(() => {
    if (!socket) return;
    const handleSocketError = (data: { message: string }) => {
      setError(data.message);
    };
    socket.on("error", handleSocketError);
    return () => {
      socket.off("error", handleSocketError);
    };
  }, [socket]);

  useEffect(() => {
    if (!socket || !selectedContact) return;

    const handleReceiveMessage = (msg: Message) => {
      const isRelevant =
        msg.sender._id === selectedContact._id ||
        msg.recipient._id === selectedContact._id;
      if (isRelevant) setMessages((prev) => [...prev, msg]);
    };

    socket.on("receiveMessage", handleReceiveMessage);
    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [socket, selectedContact]);

  const handleSend = (content: string) => {
    if (!socket || !user || !selectedContact) return;
    socket.emit("sendMessage", {
      sender: user.id,
      recipient: selectedContact._id,
      content,
    });
  };

  if (!selectedContact) {
    return (
      <div className="text-dark rounded-4 p-2 shadow-sm w-100 h-100 d-flex align-items-center justify-content-center bg-light-subtle">
        <p className="text-secondary">Select a contact to start chatting</p>
      </div>
    );
  }

  return (
    <div className="text-white rounded-4 p-2 shadow-sm w-100 h-100 d-flex flex-column bg-light-subtle">
      <MessageBoardHeader
        name={`${selectedContact.firstName} ${selectedContact.lastName}`}
      />
      {error && <AuthError message={error} />}
      <div className="flex-grow-1 overflow-auto">
        {messages.map((message) => (
          <MessageBubble
            key={message._id}
            message={message.content}
            side={message.sender._id === user?.id ? "right" : "left"}
          />
        ))}
      </div>
      <MessageInput onSend={handleSend} />
    </div>
  );
}
