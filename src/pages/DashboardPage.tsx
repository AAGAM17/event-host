import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ParticipantDashboard from "./ParticipantDashboard";
import OrganizerDashboard from "./OrganizerDashboard";
import JudgeDashboard from "./JudgeDashboard";

const DashboardPage = () => {
  const [role, setRole] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedRole = localStorage.getItem("userRole");
    if (!storedRole) {
      navigate("/login");
    } else {
      setRole(storedRole);
    }
  }, [navigate]);

  if (!role) return null;

  switch (role) {
    case "participant":
      return <ParticipantDashboard />;
    case "organizer":
      return <OrganizerDashboard />;
    case "judge":
      return <JudgeDashboard />;
    default:
      return <div>Unknown role</div>;
  }
};

export { DashboardPage };
export default DashboardPage;
