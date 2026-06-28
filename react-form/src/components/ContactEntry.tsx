export default function ContactEntry({ contactName }: { contactName: string }) {
  return (
    <div className="d-flex container align-items-center justify-content-between bg-secondary-subtle rounded-pill mt-2 shadow">
      <i className="bi bi-person-circle py-6"></i>
      <span>{contactName}</span>
    </div>
  );
}
