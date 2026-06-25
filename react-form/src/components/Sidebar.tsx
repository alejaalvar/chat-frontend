import { useState } from "react";
import ContactEntry from "./ContactEntry";

export default function Sidebar() {
  return (
    <div className="container text-bg-info rounded-4 m-1">
      <h1 className="p-3">Chat</h1>
      <ContactEntry contactName="John Doe" />
      <ContactEntry contactName="Jane Doe" />
    </div>
  );
}
