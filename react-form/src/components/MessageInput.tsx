export default function MessageInput() {
  return (
    <div className="p-3 mt-auto">
      <div className="input-group shadow-sm rounded-pill">
        <input
          type="text"
          placeholder="Type a message..."
          aria-label="Type a message"
          className="form-control border-0 rounded-start-pill"
        />
        <button
          className="btn btn-primary border-0 rounded-end-pill px-3"
          aria-label="Send message"
        >
          <i className="bi bi-send-fill" aria-hidden="true"></i>
        </button>
      </div>
    </div>
  );
}
