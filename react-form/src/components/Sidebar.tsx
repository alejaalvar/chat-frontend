import ContactEntry from "./ContactEntry";
import SearchBar from "./SearchBar";
import SidebarFooter from "./SidebarFooter";

interface Props {
  onProfileClick: () => void;
}

export default function Sidebar({ onProfileClick }: Props) {
  return (
    <div className="bg-primary-subtle shadow-sm rounded-4 p-3 h-100 d-flex flex-column bg-gradient">
      <h1 className="mb-4">
        <span className="px-3 py-2 bg-primary text-white shadow rounded-pill">
          Messaging
        </span>
      </h1>

      <SearchBar />
      <ContactEntry contactName="John Doe" />
      <ContactEntry contactName="Jane Doe" />
      <SidebarFooter onProfileClick={onProfileClick} />
    </div>
  );
}
