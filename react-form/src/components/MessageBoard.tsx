import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import type { Contact } from "./ContactEntry";
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
  createdAt: string;
}

interface Props {
  selectedContact: Contact | null;
}

export default function MessageBoard({ selectedContact }: Props) {
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (!selectedContact) return;

    fetch(`${API_URL}/api/messages/get-messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: selectedContact._id }),
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setMessages(data.messages ?? []));
  }, [selectedContact]);

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
      <div className="flex-grow-1 overflow-auto">
        {messages.map((message) => (
          <MessageBubble
            key={message._id}
            message={message.content}
            side={message.sender._id === user?.id ? "right" : "left"}
          />
        ))}
      </div>
      <MessageInput />
    </div>
  );
}
