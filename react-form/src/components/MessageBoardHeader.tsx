export default function MessageBoardHeader({
  name,
  onDismiss,
}: {
  name: string;
  onDismiss: () => void;
}) {
  return (
    <header className="d-flex text-dark justify-content-between border-bottom my-3">
      <div className="m-3">
        <i className="bi bi-person-circle py-6"></i>
        <span className="px-2">{name}</span>
      </div>
      <button
        onClick={onDismiss}
        className="btn btn-primary border-0 rounded m-2"
      >
        <i className="bi bi-x"></i>
      </button>
    </header>
  );
}
