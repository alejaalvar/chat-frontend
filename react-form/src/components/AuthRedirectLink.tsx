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
    <p className="text-center">
      {message} <Link to={to}>{linkText}</Link>
    </p>
  );
}

export default AuthRedirectLink;
