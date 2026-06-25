import { useState } from "react";
import ContactEntry from "./ContactEntry";
import SearchBar from "./SearchBar";

export default function Sidebar() {
  return (
    <div className="container bg-info-subtle shadow-sm rounded-4 m-1 h-100">
      <h1 className="p-3">Chat</h1>
      <SearchBar />
      <ContactEntry contactName="John Doe" />
      <ContactEntry contactName="Jane Doe" />
    </div>
  );
}
