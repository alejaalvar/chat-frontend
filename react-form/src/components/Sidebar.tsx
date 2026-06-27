import { useState } from "react";
import ContactEntry from "./ContactEntry";
import SearchBar from "./SearchBar";
import SidebarFooter from "./SidebarFooter";

export default function Sidebar() {
  return (
    <div className="bg-info-subtle shadow-sm rounded-4 p-3 h-100 d-flex flex-column">
      <h1 className="p-3">Chat</h1>
      <SearchBar />
      <ContactEntry contactName="John Doe" />
      <ContactEntry contactName="Jane Doe" />
      <SidebarFooter />
    </div>
  );
}
