function PasswordInput({
  label,
  id,
  currentValue,
  onChange,
}: {
  label: string;
  id: string;
  currentValue: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <>
      <label htmlFor={id}>{label} </label>
      <input
        value={currentValue}
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
