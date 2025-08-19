import React from 'react';

const teamMembers = [
  { 
    name: 'Shri Rajiv Kumar', 
    designation: 'Chief Innovation Officer, Government of India', 
    note: 'Pioneered the vision of a seamless procurement platform.', 
    avatar: '/images/rajiv3.jpeg' 
  },
  { 
    name: 'Shri Narendra Modi', 
    designation: 'Honourable Prime Minister of India', 
    note: 'Led the execution and operational rollout across departments.', 
    avatar: '/images/phool2.webp' 
  },
  { 
    name: 'Dr. Vivek Bansal', 
    designation: 'Technical Advisor', 
    note: 'Provided strategic guidance for technological infrastructure.', 
    avatar: '/images/vivek.jpg' 
  },
];

const EstablishingTeam = () => {
  return (
    <section className="py-16 ">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
          Establishing Team
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamMembers.map(({ name, designation, note, avatar }, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-md transition-transform hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex items-center mb-4">
                <img
                  src={avatar}
                  alt={name}
                  className="w-14 h-14 rounded-full bg-cover bg-center bg-no-repeat object-cover border border-gray-200"
                />
                <div className="ml-4">
                  <p className="text-gray-900 font-semibold">{name}</p>
                  <p className="text-blue-600 text-sm">{designation}</p>
                </div>
              </div>
              <p className="text-gray-700 italic">“{note}”</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EstablishingTeam;
