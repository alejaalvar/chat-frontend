function EmailInput() {
  return (
    <>
      <label htmlFor="email">Email: </label>
      <input
        className="form-control"
        placeholder="johndoe123@gmail.com"
        id="email"
        type="email"
        aria-describedby="emailHelp"
        required
      />
      <small id="emailHelp" className="form-text text-muted">
        We'll never share your email with anyone else.
      </small>
    </>
  );
}

export default EmailInput;

