import { useState } from "react";
import { useLocation } from "react-router-dom";
import ProfileSetupModal from "../components/ProfileSetupModal";

function DashboardPage() {
  const location = useLocation();
  const needsSetup = location.state?.profileSetup === false;
  const [showModal, setShowModal] = useState(needsSetup);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Dashboard route...</p>
      <ProfileSetupModal show={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}

export default DashboardPage;
