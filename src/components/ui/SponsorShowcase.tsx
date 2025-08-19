import React from "react";

const sponsors = [
  {
    id: 1,
    name: "TechCorp",
    logo: "https://dummyimage.com/100x100/4f46e5/fff&text=TechCorp",
    website: "https://techcorp.com",
    tier: "Platinum",
  },
  {
    id: 2,
    name: "InnovateX",
    logo: "https://dummyimage.com/100x100/10b981/fff&text=InnovateX",
    website: "https://innovatex.com",
    tier: "Gold",
  },
  {
    id: 3,
    name: "Cloudify",
    logo: "https://dummyimage.com/100x100/f59e42/fff&text=Cloudify",
    website: "https://cloudify.com",
    tier: "Silver",
  },
];

const partners = [
  {
    id: 1,
    name: "OpenAI",
    logo: "https://dummyimage.com/100x100/6366f1/fff&text=OpenAI",
    website: "https://openai.com",
  },
  {
    id: 2,
    name: "DevHub",
    logo: "https://dummyimage.com/100x100/22d3ee/fff&text=DevHub",
    website: "https://devhub.com",
  },
];

const SponsorShowcase = () => (
  <section className="my-12 py-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-lg">
    <div className="max-w-5xl mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-8 text-blue-800">Our Sponsors</h2>
      <div className="flex flex-wrap justify-center gap-8 mb-10">
        {sponsors.map((sponsor) => (
          <a
            key={sponsor.id}
            href={sponsor.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center bg-white rounded-lg shadow p-4 w-40 hover:scale-105 transition-transform border-2 border-blue-100"
          >
            <img src={sponsor.logo} alt={sponsor.name} className="w-20 h-20 object-contain mb-2" />
            <span className="font-semibold text-lg text-blue-700 mb-1">{sponsor.name}</span>
            <span className={`text-xs px-2 py-1 rounded-full ${
              sponsor.tier === "Platinum"
                ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
                : sponsor.tier === "Gold"
                ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white"
                : "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800"
            }`}>{sponsor.tier}</span>
          </a>
        ))}
      </div>
      <h3 className="text-2xl font-bold text-center mb-6 text-purple-700">Our Partners</h3>
      <div className="flex flex-wrap justify-center gap-8">
        {partners.map((partner) => (
          <a
            key={partner.id}
            href={partner.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center bg-white rounded-lg shadow p-4 w-40 hover:scale-105 transition-transform border-2 border-purple-100"
          >
            <img src={partner.logo} alt={partner.name} className="w-20 h-20 object-contain mb-2" />
            <span className="font-semibold text-lg text-purple-700 mb-1">{partner.name}</span>
            <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">Partner</span>
          </a>
        ))}
      </div>
    </div>
  </section>
);

export default SponsorShowcase;
