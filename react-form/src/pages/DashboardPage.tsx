import { useState } from "react";
import { useLocation } from "react-router-dom";
import ProfileSetupModal from "../components/ProfileSetupModal";
import Sidebar from "../components/Sidebar";
import MessageBoard from "../components/MessageBoard";

function DashboardPage() {
  const location = useLocation();
  const needsSetup = location.state?.profileSetup === false;
  const [showModal, setShowModal] = useState<"setup" | "edit" | false>(
    needsSetup ? "setup" : false
  );

  return (
    <div className="container-fluid m-0">
      <div className="row min-vh-100 gx-2">
        <div className="col-md-3 p-0">
          <Sidebar onProfileClick={() => setShowModal("edit")} />
        </div>
        <div className="col-md-9 p-0">
          <MessageBoard />
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
