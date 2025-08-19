import React from "react";

const mockStats = {
  eventsCreated: 4,
  activeEvents: 2,
  totalParticipants: 120,
  submissions: 35,
};

const mockEvents = [
  { id: "1", title: "Hackathon 2024", status: "Ongoing", participants: 60 },
  { id: "2", title: "AI Challenge", status: "Upcoming", participants: 40 },
];

const mockAnnouncements = [
  { id: "1", title: "Welcome!", content: "Kickoff meeting at 10am.", date: "2024-09-10" },
  { id: "2", title: "Submission Reminder", content: "Submit by 20th Sep.", date: "2024-09-15" },
];

const mockActivity = [
  { id: "1", message: "New participant registered for Hackathon 2024.", date: "2024-09-12" },
  { id: "2", message: "Project 'Smart Health App' submitted.", date: "2024-09-11" },
];

// Mock analytics data
const analytics = {
  totalRegistrations: 320,
  totalSubmissions: 85,
  totalTeams: 28,
  registrationsByDay: [
    { date: "Sep 10", count: 20 },
    { date: "Sep 11", count: 35 },
    { date: "Sep 12", count: 50 },
    { date: "Sep 13", count: 80 },
    { date: "Sep 14", count: 60 },
    { date: "Sep 15", count: 75 },
  ],
  submissionsByTrack: [
    { track: "AI/ML", count: 30 },
    { track: "Web3", count: 20 },
    { track: "FinTech", count: 15 },
    { track: "Healthcare", count: 20 },
  ],
};

const OrganizerDashboard = () => {
  const username = localStorage.getItem("username") || "Organizer";
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold mb-1">Welcome, {username}!</h1>
        <p className="text-gray-600">Manage your events, participants, and announcements here.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-100 rounded p-4 text-center">
          <div className="text-2xl font-bold">{mockStats.eventsCreated}</div>
          <div className="text-gray-700">Events Created</div>
        </div>
        <div className="bg-green-100 rounded p-4 text-center">
          <div className="text-2xl font-bold">{mockStats.activeEvents}</div>
          <div className="text-gray-700">Active Events</div>
        </div>
        <div className="bg-yellow-100 rounded p-4 text-center">
          <div className="text-2xl font-bold">{mockStats.totalParticipants}</div>
          <div className="text-gray-700">Participants</div>
        </div>
        <div className="bg-purple-100 rounded p-4 text-center">
          <div className="text-2xl font-bold">{mockStats.submissions}</div>
          <div className="text-gray-700">Submissions</div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="flex flex-wrap gap-4">
        <a href="/create-event" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Create Event</a>
        <a href="/events" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Manage Events</a>
        <a href="/leaderboard" className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">View Leaderboard</a>
      </div>

      {/* Analytics Dashboard */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-2xl font-bold mb-4 text-blue-800">Analytics Dashboard</h2>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-blue-700">{analytics.totalRegistrations}</div>
            <div className="text-gray-700">Total Registrations</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-green-700">{analytics.totalSubmissions}</div>
            <div className="text-gray-700">Total Submissions</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-purple-700">{analytics.totalTeams}</div>
            <div className="text-gray-700">Total Teams</div>
          </div>
        </div>
        {/* Registrations by Day (simple bar chart) */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2">Registrations by Day</h3>
          <div className="flex items-end gap-2 h-32">
            {analytics.registrationsByDay.map((day, idx) => (
              <div key={idx} className="flex flex-col items-center w-10">
                <div
                  className="bg-blue-500 rounded-t"
                  style={{ height: `${day.count / 2}px`, minHeight: '10px', width: '100%' }}
                  title={`${day.count} registrations`}
                ></div>
                <span className="text-xs mt-1 text-gray-600">{day.date}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Submissions by Track (horizontal bar chart) */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Submissions by Track</h3>
          <div className="space-y-2">
            {analytics.submissionsByTrack.map((track, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-24 text-sm text-gray-700">{track.track}</span>
                <div className="flex-1 bg-gray-200 rounded h-4">
                  <div
                    className="bg-green-500 h-4 rounded"
                    style={{ width: `${track.count * 4}px`, minWidth: '10px' }}
                    title={`${track.count} submissions`}
                  ></div>
                </div>
                <span className="ml-2 text-sm font-bold text-green-700">{track.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Event Management */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Your Events</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {mockEvents.map(event => (
            <div key={event.id} className="border rounded p-4 bg-white">
              <div className="font-bold text-lg">{event.title}</div>
              <div className="text-sm text-gray-600">Status: {event.status}</div>
              <div className="text-sm text-gray-500">Participants: {event.participants}</div>
              <a href={`/events/${event.id}/manage`} className="text-blue-600 hover:underline text-sm mt-2 inline-block">Manage Event</a>
            </div>
          ))}
        </div>
      </div>

      {/* Announcements */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Announcements</h2>
        <ul className="space-y-2">
          {mockAnnouncements.map(a => (
            <li key={a.id} className="p-3 rounded bg-blue-50 border-l-4 border-blue-400">
              <span className="font-bold">{a.title}:</span> {a.content} <span className="text-gray-600">({a.date})</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Recent Activity</h2>
        <ul className="space-y-2">
          {mockActivity.map(a => (
            <li key={a.id} className="p-3 rounded bg-green-50 border-l-4 border-green-400">
              {a.message} <span className="text-gray-600">({a.date})</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OrganizerDashboard;
