import { Link } from "react-router-dom";

interface Props {
  onProfileClick: () => void;
}

export default function SidebarFooter({ onProfileClick }: Props) {
  return (
    <div className="d-flex flex-row-reverse w-100 rounded-pill shadow mt-auto bg-secondary-subtle bg-gradient">
      <Link to="/login" className="p-3 bg-light-subtle rounded-end-pill">
        Logout
      </Link>
      <button
        className="btn border-0 p-3 bg-light-subtle rounded-start-pill"
        onClick={onProfileClick}
      >
        Profile
      </button>
    </div>
  );
}
