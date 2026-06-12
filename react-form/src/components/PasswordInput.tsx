function PasswordInput({
  label,
  id,
  value,
  onChange,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <>
      <label htmlFor={id}>{label} </label>
      <input
        value={value}
        onChange={onChange}
        className="form-control"
        id={id}
        type="password"
        required
      />
    </>
  );
}

export default PasswordInput;

