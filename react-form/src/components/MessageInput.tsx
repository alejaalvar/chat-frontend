import { useState } from "react";

interface Props {
  onSend: (content: string) => void;
}

export default function MessageInput({ onSend }: Props) {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
  };

  return (
    <form className="p-3 mt-auto" onSubmit={handleSubmit}>
      <div className="input-group shadow-sm rounded-pill">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          aria-label="Type a message"
          className="form-control border-0 rounded-start-pill"
        />
        <button
          type="submit"
          className="btn btn-primary border-0 rounded-end-pill px-3"
          aria-label="Send message"
        >
          <i className="bi bi-send-fill" aria-hidden="true"></i>
        </button>
      </div>
    </form>
  );
}
