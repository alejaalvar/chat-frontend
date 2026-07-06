export interface Contact {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  image?: string;
  color?: string;
}

interface Props {
  contact: Contact;
  onClick: (contact: Contact) => void;
}

export default function ContactEntry({ contact, onClick }: Props) {
  return (
    <button
      className="btn d-flex w-100 align-items-center justify-content-between bg-secondary-subtle rounded-pill mt-2 shadow border-0 p-0 px-3"
      onClick={() => onClick(contact)}
    >
      <i className="bi bi-person-circle py-6"></i>
      <span>
        {contact.firstName} {contact.lastName}
      </span>
    </button>
  );
}
