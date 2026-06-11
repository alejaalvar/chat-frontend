function AuthSubmit({ message }: { message: string }) {
  return (
    <button className="btn btn-primary w-100" type="submit">
      {message}
    </button>
  );
}

export default AuthSubmit;
