import { useState } from "react";
import { useUser } from "../context/UserContext";
import ProfileSetupModal from "../components/ProfileSetupModal";
import Sidebar from "../components/Sidebar";
import MessageBoard from "../components/MessageBoard";
import type { Contact } from "../components/ContactEntry";

function DashboardPage() {
  const { user } = useUser();
  const [showModal, setShowModal] = useState<"setup" | "edit" | false>(
    user?.profileSetup === false ? "setup" : false
  );
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  return (
    <div className="container-fluid m-0">
      <div className="row min-vh-100 gx-2">
        <div className="col-md-3 p-0">
          <Sidebar
            onProfileClick={() => setShowModal("edit")}
            onContactSelect={setSelectedContact}
          />
        </div>
        <div className="col-md-9 p-0">
          <MessageBoard selectedContact={selectedContact} />
        </div>
      </div>
      <ProfileSetupModal
        show={showModal !== false}
        mode={showModal || "edit"}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}

export default DashboardPage;
