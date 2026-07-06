import { Link } from "react-router-dom";

interface Props {
  onProfileClick: () => void;
}

export default function SidebarFooter({ onProfileClick }: Props) {
  return (
    <div className="d-flex flex-row-reverse w-100 rounded-pill shadow mt-auto py-1">
      <Link to="/login" className="p-2 btn btn-danger rounded-pill">
        Logout
      </Link>
      <button
        className="btn btn-secondary border-0 p-2 rounded-pill me-2"
        onClick={onProfileClick}
      >
        Profile
      </button>
    </div>
  );
}
