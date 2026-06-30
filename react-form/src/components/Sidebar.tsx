import { useState, useEffect } from "react";
import ContactEntry from "./ContactEntry";
import type { Contact } from "./ContactEntry";
import SearchBar from "./SearchBar";
import SidebarFooter from "./SidebarFooter";
import AuthError from "./AuthError";
import { useFetch } from "../hooks/useFetch";

const API_URL = import.meta.env.VITE_API_URL;

interface ContactsResponse {
  contacts: Contact[];
}

interface Props {
  onContactSelect: (contact: Contact) => void;
  onProfileClick: () => void;
}

export default function Sidebar({ onContactSelect, onProfileClick }: Props) {
  const [searchResults, setSearchResults] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchError, setSearchError] = useState<string | null>(null);

  const { data: contactsData, error: contactsError } =
    useFetch<ContactsResponse>(
      () =>
        fetch(`${API_URL}/api/contacts/get-contacts-for-list`, {
          credentials: "include",
        }).then((r) => r.json()),
      []
    );

  const contacts: Contact[] = contactsData?.contacts ?? [];

  useEffect(() => {
    if (!searchQuery.trim()) {
      return;
    }

    const timer = setTimeout(() => {
      setSearchError(null);
      fetch(`${API_URL}/api/contacts/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ searchTerm: searchQuery }),
        credentials: "include",
      })
        .then((r) => r.json())
        .then((data) => setSearchResults(data.contacts ?? []))
        .catch((e) =>
          setSearchError(e instanceof Error ? e.message : "Search failed")
        );
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const displayedContacts = searchQuery.trim() ? searchResults : contacts;
  const error = contactsError ?? searchError;

  return (
    <aside className="bg-primary-subtle shadow-sm rounded-4 p-3 h-100 d-flex flex-column bg-gradient">
      <h1 className="mb-4">
        <span className="px-3 py-2 bg-primary text-white shadow rounded-pill">
          Messaging
        </span>
      </h1>
      <SearchBar
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {error && <AuthError message={error} />}
      {displayedContacts.map((contact) => (
        <ContactEntry
          key={contact._id}
          contact={contact}
          onClick={onContactSelect}
        />
      ))}
      <SidebarFooter onProfileClick={onProfileClick} />
    </aside>
  );
}
