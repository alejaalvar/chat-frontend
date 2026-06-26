export default function MessageBoardHeader({ name }: { name: string }) {
  return (
    <div className="d-flex text-dark justify-content-between border-bottom my-3">
      <div className="m-3">
        <i className="bi bi-person-circle py-6"></i>
        <span className="px-2">{name}</span>
      </div>
      <button className="btn btn-primary border-0 rounded m-2">
        <i className="bi bi-x"></i>
      </button>
    </div>
  );
}
