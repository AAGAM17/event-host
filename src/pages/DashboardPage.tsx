import { useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import ParticipantDashboard from "./ParticipantDashboard";
import OrganizerDashboard from "./OrganizerDashboard";
import JudgeDashboard from "./JudgeDashboard";

const DashboardPage = () => {
  const { user, loading } = useAuth();
  const role = useMemo(() => user?.role ?? null, [user]);

  if (loading) return null;
  if (!role) return <div>Unknown role</div>;

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
