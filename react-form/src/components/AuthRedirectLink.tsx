import { Link } from "react-router-dom";

function AuthRedirectLink({
  message,
  linkText,
  to,
}: {
  message: string;
  linkText: string;
  to: string;
}) {
  return (
    <small className="text-center text-muted">
      {message} <Link to={to}>{linkText}</Link>
    </small>
  );
}

export default AuthRedirectLink;
