export default function SearchBar() {
  return (
    <div className="px-3 pb-3">
      <div className="input-group">
        <span className="input-group-text bg-white border-0 rounded-start-pill ps-3 shadow-sm">
          <i className="bi bi-search" aria-hidden="true"></i>
        </span>
        <input
          id="contact-search"
          type="text"
          placeholder="Search contacts..."
          aria-label="Search contacts"
          className="form-control border-0 rounded-end-pill shadow-sm"
        />
      </div>
    </div>
  );
}
