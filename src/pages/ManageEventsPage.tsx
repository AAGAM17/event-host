import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";

const mockEvents = [
  {
    id: "1",
    title: "Hackathon 2024",
    theme: "Innovation & Technology",
    type: "hybrid",
    startDate: "2024-09-15",
    endDate: "2024-09-17",
    status: "upcoming",
  },
  {
    id: "2",
    title: "EcoHack 2024",
    theme: "Sustainability",
    type: "online",
    startDate: "2024-08-20",
    endDate: "2024-08-22",
    status: "ongoing",
  },
  {
    id: "3",
    title: "HealthTech Innovation",
    theme: "Healthcare",
    type: "offline",
    startDate: "2024-09-25",
    endDate: "2024-09-27",
    status: "upcoming",
  },
];

const ManageEventsPage = () => {
  const [events, setEvents] = useState(mockEvents);

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      setEvents(events.filter((event) => event.id !== id));
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Manage Your Events</h1>
      <div className="mb-6 flex justify-end">
        <Link to="/create-event">
          <Button className="bg-blue-600 text-white hover:bg-blue-700">+ Create New Event</Button>
        </Link>
      </div>
      <div className="bg-white rounded-xl shadow p-6">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-2 px-3">Title</th>
              <th className="py-2 px-3">Theme</th>
              <th className="py-2 px-3">Type</th>
              <th className="py-2 px-3">Start</th>
              <th className="py-2 px-3">End</th>
              <th className="py-2 px-3">Status</th>
              <th className="py-2 px-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id} className="border-b hover:bg-blue-50">
                <td className="py-2 px-3 font-semibold">{event.title}</td>
                <td className="py-2 px-3">{event.theme}</td>
                <td className="py-2 px-3 capitalize">{event.type}</td>
                <td className="py-2 px-3">{event.startDate}</td>
                <td className="py-2 px-3">{event.endDate}</td>
                <td className="py-2 px-3 capitalize">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    event.status === "ongoing"
                      ? "bg-green-100 text-green-700"
                      : event.status === "upcoming"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-700"
                  }`}>{event.status}</span>
                </td>
                <td className="py-2 px-3 space-x-2">
                  <Link to={`/edit-event/${event.id}`}>
                    <Button size="sm" variant="outline">Edit</Button>
                  </Link>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(event.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-500">No events found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageEventsPage;
