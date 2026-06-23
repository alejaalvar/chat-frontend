import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

interface Props {
  show: boolean;
  onClose: () => void;
}

function ProfileSetupModal({ show, onClose }: Props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!show) return null;

  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      setError("First name and last name are required.");
      setFirstName("");
      setLastName("");
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/update-profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }
      onClose();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div
        className="modal fade show d-block"
        tabIndex={-1}
        aria-labelledby="updateProfileLabel"
        aria-modal="true"
        role="dialog"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="updateProfileLabel">
                Welcome!
              </h1>
            </div>
            <div className="modal-body">
              <p className="fst-italic text-secondary-emphasis">
                Let's finish setting up your profile...
              </p>
              <form>
                <div className="mb-3">
                  <label htmlFor="first-name" className="col-form-label">
                    First name:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="first-name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="last-name" className="col-form-label">
                    Last name:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="last-name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
                {error && <p className="text-danger">{error}</p>}
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSave}
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
}

export default ProfileSetupModal;
