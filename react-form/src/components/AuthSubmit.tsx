function AuthSubmit({
  message,
  isDisabled,
}: {
  message: string;
  isDisabled: boolean;
}) {
  return (
    <button
      className="btn btn-primary w-100"
      type="submit"
      disabled={isDisabled}
    >
      {message}
    </button>
  );
}

export default AuthSubmit;
