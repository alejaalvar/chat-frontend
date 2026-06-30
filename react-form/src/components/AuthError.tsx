function AuthError({ message }: { message: string }) {
  return <p role="alert" className="text-danger">{message}</p>;
}

export default AuthError;
