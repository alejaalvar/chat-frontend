import { useState } from "react";
import { useLocation } from "react-router-dom";
import ProfileSetupModal from "../components/ProfileSetupModal";
import Sidebar from "../components/Sidebar";
import MessageBoard from "../components/MessageBoard";

function DashboardPage() {
  const location = useLocation();
  const needsSetup = location.state?.profileSetup === false;
  const [showModal, setShowModal] = useState(needsSetup);

  return (
    <div className="container">
      <h1>Dashboard</h1>
      <div className="row">
        <div className="col">
          <Sidebar />
        </div>
        <div className="col">
          <MessageBoard />
        </div>
      </div>
      <ProfileSetupModal show={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}

export default DashboardPage;
