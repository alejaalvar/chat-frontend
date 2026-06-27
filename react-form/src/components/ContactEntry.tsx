export default function ContactEntry({ contactName }: { contactName: string }) {
  return (
    <div className="container text-bg-secondary rounded-pill mt-2">
      <p className="p-3">{contactName}</p>
    </div>
  );
}
