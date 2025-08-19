import React from "react";

const mockStats = {
  eventsJudged: 3,
  projectsReviewed: 12,
  avgScore: 8.5,
  pendingReviews: 4,
};

const mockAssignedEvents = [
  { id: "1", title: "Hackathon 2024", track: "AI/ML", deadline: "2024-09-22" },
  { id: "2", title: "AI Challenge", track: "Robotics", deadline: "2024-10-10" },
];

const mockProjects = [
  { id: "1", title: "Smart Health App", team: "Code Ninjas", status: "Pending" },
  { id: "2", title: "Eco Tracker", team: "Bug Smashers", status: "Reviewed" },
];

const mockEvaluations = [
  { id: "1", project: "Smart Health App", score: 9, date: "2024-09-18" },
  { id: "2", project: "Eco Tracker", score: 8, date: "2024-09-15" },
];

const mockNotifications = [
  { id: "1", message: "4 projects pending review!", type: "warning" },
  { id: "2", message: "Review deadline for 'Hackathon 2024' is in 2 days.", type: "info" },
];

const JudgeDashboard = () => {
  const username = localStorage.getItem("username") || "Judge";
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold mb-1">Welcome, {username}!</h1>
        <p className="text-gray-600">Review and score projects for your assigned events.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-100 rounded p-4 text-center">
          <div className="text-2xl font-bold">{mockStats.eventsJudged}</div>
          <div className="text-gray-700">Events Judged</div>
        </div>
        <div className="bg-green-100 rounded p-4 text-center">
          <div className="text-2xl font-bold">{mockStats.projectsReviewed}</div>
          <div className="text-gray-700">Projects Reviewed</div>
        </div>
        <div className="bg-yellow-100 rounded p-4 text-center">
          <div className="text-2xl font-bold">{mockStats.avgScore}</div>
          <div className="text-gray-700">Avg. Score</div>
        </div>
        <div className="bg-purple-100 rounded p-4 text-center">
          <div className="text-2xl font-bold">{mockStats.pendingReviews}</div>
          <div className="text-gray-700">Pending Reviews</div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="flex flex-wrap gap-4">
        <a href="/events" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Assigned Events</a>
        <a href="/submission" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Review Projects</a>
        <a href="/leaderboard" className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">Leaderboard</a>
      </div>

      {/* Notifications */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Notifications</h2>
        <ul className="space-y-2">
          {mockNotifications.map(n => (
            <li key={n.id} className={`p-3 rounded ${n.type === "warning" ? "bg-yellow-50 border-l-4 border-yellow-400" : "bg-blue-50 border-l-4 border-blue-400"}`}>
              {n.message}
            </li>
          ))}
        </ul>
      </div>

      {/* Assigned Events/Tracks */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Assigned Events/Tracks</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {mockAssignedEvents.map(event => (
            <div key={event.id} className="border rounded p-4 bg-white">
              <div className="font-bold text-lg">{event.title}</div>
              <div className="text-sm text-gray-600">Track: {event.track}</div>
              <div className="text-sm text-gray-500">Review Deadline: {event.deadline}</div>
              <a href={`/events/${event.id}`} className="text-blue-600 hover:underline text-sm mt-2 inline-block">View Event</a>
            </div>
          ))}
        </div>
      </div>

      {/* Projects to Review */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Projects to Review</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {mockProjects.map(proj => (
            <div key={proj.id} className="border rounded p-4 bg-white">
              <div className="font-bold">{proj.title}</div>
              <div className="text-sm text-gray-600">Team: {proj.team}</div>
              <div className="text-sm text-gray-500">Status: {proj.status}</div>
              <a href="/submission" className="text-green-600 hover:underline text-sm mt-2 inline-block">Score Project</a>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Evaluations */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Recent Evaluations</h2>
        <ul className="space-y-2">
          {mockEvaluations.map(e => (
            <li key={e.id} className="p-3 rounded bg-yellow-50 border-l-4 border-yellow-400">
              <span className="font-bold">{e.project}</span> - Score: <span className="text-green-700 font-bold">{e.score}</span> <span className="text-gray-600">({e.date})</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default JudgeDashboard;
